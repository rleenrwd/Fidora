using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(FidoraDbContext context)
    {
        if (!await context.Sessions.AnyAsync())
        {
            var focusLounge = await context.Spaces
                .SingleAsync(space => space.Slug == "focus-lounge");

            var nightOwlRoom = await context.Spaces
                .SingleAsync(space => space.Slug == "night-owl-room");

            var deepWorkBooth = await context.Spaces
                .SingleAsync(space => space.Slug == "deep-work-booth");

            var now = DateTimeOffset.Now;

            var startDate = new DateTimeOffset(
                now.Year,
                now.Month,
                now.Day,
                0,
                0,
                0,
                now.Offset);

            var endDate = new DateTimeOffset(
                2026,
                12,
                31,
                0,
                0,
                0,
                now.Offset);

            var sessions = new List<Session>();

            for (var date = startDate; date <= endDate; date = date.AddDays(1))
            {
                // Focus Lounge
                sessions.Add(new Session
                {
                    SpaceId = focusLounge.Id,
                    StartTime = date.AddHours(10),
                    EndTime = date.AddHours(12),
                    Capacity = 30,
                    SessionType = SessionType.StandardFocus
                });

                sessions.Add(new Session
                {
                    SpaceId = focusLounge.Id,
                    StartTime = date.AddHours(18),
                    EndTime = date.AddHours(20),
                    Capacity = 30,
                    SessionType = SessionType.Focus50_10
                });

                // Night Owl Room
                sessions.Add(new Session
                {
                    SpaceId = nightOwlRoom.Id,
                    StartTime = date.AddHours(19),
                    EndTime = date.AddHours(21),
                    Capacity = 20,
                    SessionType = SessionType.StandardFocus
                });

                sessions.Add(new Session
                {
                    SpaceId = nightOwlRoom.Id,
                    StartTime = date.AddHours(21),
                    EndTime = date.AddHours(23),
                    Capacity = 20,
                    SessionType = SessionType.Focus50_10
                });

                // Deep Work Booth
                sessions.Add(new Session
                {
                    SpaceId = deepWorkBooth.Id,
                    StartTime = date.AddHours(9),
                    EndTime = date.AddHours(11),
                    Capacity = 10,
                    SessionType = SessionType.StandardFocus
                });

                sessions.Add(new Session
                {
                    SpaceId = deepWorkBooth.Id,
                    StartTime = date.AddHours(14),
                    EndTime = date.AddHours(16),
                    Capacity = 10,
                    SessionType = SessionType.Focus50_10
                });
            }

            await context.Sessions.AddRangeAsync(sessions);
            await context.SaveChangesAsync();
        }
    }
}