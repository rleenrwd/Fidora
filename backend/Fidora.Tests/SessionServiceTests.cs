using Fidora.Api.Data;
using Fidora.Api.Models;
using Fidora.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Tests;

public class SessionServiceTests
{
    [Fact]
    public async Task GetByIdAsync_CalculatesRemainingSeatsFromConfirmedBookings()
    {
        // ARRANGE
        await using var connection =
            new SqliteConnection("DataSource=:memory:");

        await connection.OpenAsync();

        var options =
            new DbContextOptionsBuilder<FidoraDbContext>()
                .UseSqlite(connection)
                .Options;

        await using var context =
            new FidoraDbContext(options);

        await context.Database.EnsureCreatedAsync();

        var space = new Space
        {
            Name = "Focus Lounge",
            Slug = "focus-lounge",
            Description = "Test space",
            Aura = "Energetic",
            LofiStyle = "Lofi Hip-Hop",
            Capacity = 30,
            ImageUrl = "/images/focus-lounge.jpg"
        };

        context.Spaces.Add(space);
        await context.SaveChangesAsync();

        var session = new Session
        {
            SpaceId = space.Id,
            StartTime = DateTimeOffset.UtcNow.AddDays(1),
            EndTime = DateTimeOffset.UtcNow.AddDays(1).AddHours(2),
            Capacity = 30,
            SessionType = SessionType.StandardFocus
        };

        context.Sessions.Add(session);
        await context.SaveChangesAsync();

        context.Bookings.AddRange(
            new Booking
            {
                BookingReference = "BOOK1234",
                SessionId = session.Id,
                CustomerName = "User One",
                Email = "one@example.com",
                SeatCount = 4,
                Status = BookingStatus.Confirmed,
                CreatedAtUtc = DateTime.UtcNow
            },
            new Booking
            {
                BookingReference = "BOOK5678",
                SessionId = session.Id,
                CustomerName = "User Two",
                Email = "two@example.com",
                SeatCount = 3,
                Status = BookingStatus.Cancelled,
                CreatedAtUtc = DateTime.UtcNow,
                CancelledAtUtc = DateTime.UtcNow
            }
        );

        await context.SaveChangesAsync();

        var service = new SessionService(context);

        // ACT
        var result = await service.GetByIdAsync(session.Id);

        // ASSERT
        Assert.NotNull(result);
        Assert.Equal(26, result.RemainingSeats);
    }
}