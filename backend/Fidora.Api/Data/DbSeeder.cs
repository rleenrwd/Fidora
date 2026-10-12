using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(FidoraDbContext context)
    {
        if (await context.Sessions.AnyAsync())
        {
            return;
        }

        var focusLounge = await context.Spaces
            .SingleAsync(space => space.Slug == "focus-lounge");

        var nightOwlRoom = await context.Spaces
            .SingleAsync(space => space.Slug == "night-owl-room");

        var deepWorkBooth = await context.Spaces
            .SingleAsync(space => space.Slug == "deep-work-booth");

        var pacificTimeZone = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "Pacific Standard Time"
                : "America/Los_Angeles");

        var now = TimeZoneInfo.ConvertTime(
            DateTimeOffset.UtcNow,
            pacificTimeZone);

        var startDate = DateOnly.FromDateTime(now.DateTime);
        var endDate = new DateOnly(2026, 12, 31);

        var sessions = new List<Session>();

        for (
            var date = startDate;
            date <= endDate;
            date = date.AddDays(1))
        {
            // Focus Lounge
            AddSession(
                focusLounge.Id, date, 10, 12, 30,
                SessionType.StandardFocus);

            AddSession(
                focusLounge.Id, date, 18, 20, 30,
                SessionType.Focus50_10);

            // Night Owl Room
            AddSession(
                nightOwlRoom.Id, date, 19, 21, 20,
                SessionType.StandardFocus);

            AddSession(
                nightOwlRoom.Id, date, 21, 23, 20,
                SessionType.Focus50_10);

            // Deep Work Booth
            AddSession(
                deepWorkBooth.Id, date, 9, 11, 10,
                SessionType.StandardFocus);

            AddSession(
                deepWorkBooth.Id, date, 14, 16, 10,
                SessionType.Focus50_10);
        }

        await context.Sessions.AddRangeAsync(sessions);
        await context.SaveChangesAsync();

        void AddSession(
            int spaceId,
            DateOnly date,
            int startHour,
            int endHour,
            int capacity,
            SessionType sessionType)
        {
            var localStart = date.ToDateTime(
                new TimeOnly(startHour, 0),
                DateTimeKind.Unspecified);

            var localEnd = date.ToDateTime(
                new TimeOnly(endHour, 0),
                DateTimeKind.Unspecified);

            var startTime = new DateTimeOffset(
                localStart,
                pacificTimeZone.GetUtcOffset(localStart));

            var endTime = new DateTimeOffset(
                localEnd,
                pacificTimeZone.GetUtcOffset(localEnd));

            if (startTime <= DateTimeOffset.UtcNow)
            {
                return;
            }

            sessions.Add(new Session
            {
                SpaceId = spaceId,
                StartTime = startTime,
                EndTime = endTime,
                Capacity = capacity,
                SessionType = sessionType
            });
        }
    }
}