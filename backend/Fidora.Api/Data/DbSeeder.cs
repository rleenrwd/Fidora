using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(FidoraDbContext context)
    {
        if (!await context.Spaces.AnyAsync())
        {
            var spaces = new[]
            {
                new Space
                {
                    Name = "Focus Lounge",
                    Slug = "focus-lounge",
                    Description = "A social, energetic study space designed for focused work around others.",
                    Aura = "Energetic & Social",
                    LofiStyle = "Lofi Hip-Hop",
                    Capacity = 30,
                    ImageUrl = "/images/focus-lounge.jpg"
                },

                new Space
                {
                    Name = "Night Owl Room",
                    Slug = "night-owl-room",
                    Description = "A darker, calmer study environment built for relaxed late-night focus.",
                    Aura = "Calm & Late-Night",
                    LofiStyle = "Lofi Jazz",
                    Capacity = 20,
                    ImageUrl = "/images/night-owl-room.jpg"
                },

                new Space
                {
                    Name = "Deep Work Booth",
                    Slug = "deep-work-booth",
                    Description = "A minimal-distraction space for concentrated individual work.",
                    Aura = "Quiet & Focused",
                    LofiStyle = "Ambient Lofi",
                    Capacity = 10,
                    ImageUrl = "/images/deep-work-booth.jpg"
                }
            };

            await context.Spaces.AddRangeAsync(spaces);
            await context.SaveChangesAsync();
        }

        if (!await context.Sessions.AnyAsync())
        {
            var focusLounge = await context.Spaces
                .SingleAsync(space => space.Slug == "focus-lounge");

            var nightOwlRoom = await context.Spaces
                .SingleAsync(space => space.Slug == "night-owl-room");

            var deepWorkBooth = await context.Spaces
                .SingleAsync(space => space.Slug == "deep-work-booth");

            var now = DateTimeOffset.Now;

            var tomorrow = new DateTimeOffset(
                now.Year,
                now.Month,
                now.Day,
                0,
                0,
                0,
                now.Offset)
                .AddDays(1);

            var sessions = new[]
            {
                new Session
                {
                    SpaceId = focusLounge.Id,
                    StartTime = tomorrow.AddHours(10),
                    EndTime = tomorrow.AddHours(12),
                    Capacity = 30,
                    SessionType = SessionType.StandardFocus
                },

                new Session
                {
                    SpaceId = focusLounge.Id,
                    StartTime = tomorrow.AddHours(18),
                    EndTime = tomorrow.AddHours(20),
                    Capacity = 30,
                    SessionType = SessionType.Focus50_10
                },

                new Session
                {
                    SpaceId = nightOwlRoom.Id,
                    StartTime = tomorrow.AddHours(19),
                    EndTime = tomorrow.AddHours(21),
                    Capacity = 20,
                    SessionType = SessionType.StandardFocus
                },

                new Session
                {
                    SpaceId = nightOwlRoom.Id,
                    StartTime = tomorrow.AddDays(1).AddHours(20),
                    EndTime = tomorrow.AddDays(1).AddHours(22),
                    Capacity = 20,
                    SessionType = SessionType.Focus50_10
                },

                new Session
                {
                    SpaceId = deepWorkBooth.Id,
                    StartTime = tomorrow.AddHours(9),
                    EndTime = tomorrow.AddHours(11),
                    Capacity = 10,
                    SessionType = SessionType.StandardFocus
                },

                new Session
                {
                    SpaceId = deepWorkBooth.Id,
                    StartTime = tomorrow.AddDays(1).AddHours(14),
                    EndTime = tomorrow.AddDays(1).AddHours(16),
                    Capacity = 10,
                    SessionType = SessionType.Focus50_10
                }
            };

            await context.Sessions.AddRangeAsync(sessions);
            await context.SaveChangesAsync();
        }
    }
}