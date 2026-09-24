using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Data;

public static class Dbseeder
{
    public static async Task SeedAsync(FidoraDbContext context)
    {
        if (await context.Spaces.AnyAsync()) // if db has spaces already, don't add anything just return
        {
            return;
        }

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
}