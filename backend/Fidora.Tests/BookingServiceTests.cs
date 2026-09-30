using Fidora.Api.Data;
using Fidora.Api.DTOs;
using Fidora.Api.Models;
using Fidora.Api.Services;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Tests;

public class BookingServiceTests
{
    [Fact]
    public async Task CreateAsync_CreatesConfirmedBooking()
    {
        // ARRANGE
        await using var connection = new SqliteConnection("DataSource=:memory:"); // creates a temp in-memory database.

        await connection.OpenAsync(); // opens db connection

        //Builds the db settings for FidoraDbContext, configures them to use SQlite and stores those settings in options.
        var options = new DbContextOptionsBuilder<FidoraDbContext>().UseSqlite(connection).Options; 

        await using var context = new FidoraDbContext(options); // Creates a Fidora DB context using the temp DB instead of our real SQL Server DB

        await context.Database.EnsureCreatedAsync(); // Creates the Fidora tables in the temp DB based on our EF model

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

        var service = new BookingService(context);

        var request = new CreateBookingRequest
        {
            SessionId = session.Id,
            CustomerName = "Test User",
            Email = "test@example.com",
            SeatCount = 2
        };

        // ACT
        var result = await service.CreateAsync(request);

        // ASSERT
        Assert.Equal(BookingStatus.Confirmed, result.Status);
        Assert.Equal("Test User", result.CustomerName);
        Assert.Equal(2, result.SeatCount);
        Assert.False(string.IsNullOrWhiteSpace(result.BookingReference));

        var savedBooking = await context.Bookings.SingleAsync();

        Assert.Equal(BookingStatus.Confirmed, savedBooking.Status);
        Assert.Equal(2, savedBooking.SeatCount);
    }


    [Fact]
    public async Task CreateAsync_ThrowsWhenNotEnoughSeatsAvailable()
    {
        // ARRANGE
        await using var connection = new SqliteConnection("DataSource=:memory:");

        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<FidoraDbContext>().UseSqlite(connection).Options;

        await using var context = new FidoraDbContext(options);

        await context.Database.EnsureCreatedAsync();

        var space = new Space
        {
            Name = "Deep Work Booth",
            Slug = "deep-work-booth",
            Description = "Test space",
            Aura = "Focused",
            LofiStyle = "Ambient Lofi",
            Capacity = 10,
            ImageUrl = "/images/deep-work-booth.jpg"
        };

        context.Spaces.Add(space);
        await context.SaveChangesAsync();

        var session = new Session
        {
            SpaceId = space.Id,
            StartTime = DateTimeOffset.UtcNow.AddDays(1),
            EndTime = DateTimeOffset.UtcNow.AddDays(1).AddHours(2),
            Capacity = 10,
            SessionType = SessionType.StandardFocus
        };

        context.Sessions.Add(session);
        await context.SaveChangesAsync();


        var existingBooking = new Booking
        {
            BookingReference = "TEST1234",
            SessionId = session.Id,
            CustomerName = "Existing User",
            Email = "existing@example.com",
            SeatCount = 9,
            Status = BookingStatus.Confirmed,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.Bookings.Add(existingBooking);
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        var request = new CreateBookingRequest
        {
            SessionId = session.Id,
            CustomerName = "New User",
            Email = "new@example.com",
            SeatCount = 2
        };

        // ACT
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateAsync(request));

        // ASSERT
        Assert.Equal(
            "Not enough seats are available.",
            exception.Message);
    }

    [Fact]
    public async Task Cancel_Async_CancelsConfirmedBooking()
    {
        // ARRANGE
        await using var connection = new SqliteConnection("DataSource=:memory:");

        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<FidoraDbContext>().UseSqlite(connection).Options;

        await using var context = new FidoraDbContext(options);

        await context.Database.EnsureCreatedAsync();

        var space = new Space
        {
            Name = "Focus Lounge",
            Slug = "focus-lounge",
            Description = "Test Space",
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

        var booking = new Booking
        {
            BookingReference = "TEST1234",
            SessionId = session.Id,
            CustomerName = "Test User",
            Email = "test@example.com",
            SeatCount = 2,
            Status = BookingStatus.Confirmed,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        // ACT 
        var result = await service.CancelAsync("TEST1234");

        // ASSERT
        Assert.Equal(BookingStatus.Cancelled, result.Status);
        Assert.NotNull(result.CancelledAtUtc);

        var savedBooking = await context.Bookings.SingleAsync();

        Assert.Equal(BookingStatus.Cancelled, savedBooking.Status);
        Assert.NotNull(savedBooking.CancelledAtUtc);
    }

    [Fact]
    public async Task CancelAsync_ThrowsWhenBookingAlreadyCancelled()
    {
        // ARRANGE
        await using var connection = new SqliteConnection("DataSource=:memory:");

        await connection.OpenAsync();

        var options = new DbContextOptionsBuilder<FidoraDbContext>().UseSqlite(connection).Options;

        await using var context = new FidoraDbContext(options);

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

        var booking = new Booking
        {
            BookingReference = "TEST1234",
            SessionId = session.Id,
            CustomerName = "Test User",
            Email = "test@example.com",
            SeatCount = 2,
            Status = BookingStatus.Cancelled,
            CreatedAtUtc = DateTime.UtcNow.AddHours(-1),
            CancelledAtUtc = DateTime.UtcNow
        };

        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        // ACT
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CancelAsync("TEST1234"));

        // ASSERT
        Assert.Equal("This booking has already been cancelled.", exception.Message);
    }

    [Fact]
    public async Task GetByReferenceAsync_ReturnsMatchingBooking()
    {
        // ARRABNGE
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

        var booking = new Booking
        {
            BookingReference = "LOOK1234",
            SessionId = session.Id,
            CustomerName = "Test User",
            Email = "test@example.com",
            SeatCount = 2,
            Status = BookingStatus.Confirmed,
            CreatedAtUtc = DateTime.UtcNow
        };

        context.Bookings.Add(booking);
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        // ACT
        var result = await service.GetByReferenceAsync("LOOK1234");

        // ASSERT
        Assert.NotNull(result);
        Assert.Equal("LOOK1234", result.BookingReference);
        Assert.Equal("Test User", result.CustomerName);
        Assert.Equal(BookingStatus.Confirmed, result.Status);
        Assert.Equal(session.Id, result.Session.Id);
        Assert.Equal("Focus Lounge", result.Session.Space.Name);
    }

    [Fact]
    public async Task CreateAsync_ThrowsWhenSessionHasAlreadyStarted()
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
            StartTime = DateTimeOffset.UtcNow.AddHours(-2),
            EndTime = DateTimeOffset.UtcNow.AddHours(-1),
            Capacity = 30,
            SessionType = SessionType.StandardFocus
        };

        context.Sessions.Add(session);
        await context.SaveChangesAsync();

        var service = new BookingService(context);

        var request = new CreateBookingRequest
        {
            SessionId = session.Id,
            CustomerName = "Test User",
            Email = "test@example.com",
            SeatCount = 1
        };

        // ACT
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateAsync(request));

        // ASSERT
        Assert.Equal(
            "This session has already started.",
            exception.Message);
    }
}