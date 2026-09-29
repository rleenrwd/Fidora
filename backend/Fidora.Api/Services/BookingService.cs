using System.Security.Cryptography;
using Fidora.Api.Data;
using Fidora.Api.DTOs;
using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Services;

public class BookingService
{
    private readonly FidoraDbContext _context;

    public BookingService(FidoraDbContext context)
    {
        _context = context;
    }

    public async Task<BookingResponse> CreateAsync(CreateBookingRequest request)
    {
        var session = await _context.Sessions.Include(session => session.Space).FirstOrDefaultAsync(session => session.Id == request.SessionId);

        if (session is null)
        {
            throw new KeyNotFoundException("Session not found.");
        }

        if (request.SeatCount <= 0)
        {
            throw new ArgumentException("Seat count must be greater than zero.");
        }

        if (session.StartTime <= DateTimeOffset.UtcNow)
        {
            throw new InvalidOperationException("This session has already started.");
        }

        var reservedSeats = await _context.Bookings.Where(booking => booking.SessionId == session.Id && booking.Status == BookingStatus.Confirmed).SumAsync(booking => (int?) booking.SeatCount) ?? 0;

        var remainingSeats = session.Capacity - reservedSeats;

        if (request.SeatCount > remainingSeats)
        {
            throw new InvalidOperationException ("Not enough seats are available.");
        }

        var booking = new Booking
        {
            BookingReference = await GenerateBookingReferenceAsync(),
            SessionId = session.Id,
            CustomerName = request.CustomerName,
            Email = request.Email,
            SeatCount = request.SeatCount,
            Status = BookingStatus.Confirmed,
            CreatedAtUtc = DateTime.UtcNow
        };

        await _context.Bookings.AddAsync(booking);
        await _context.SaveChangesAsync();

        return MapToResponse(booking, session);
    }

    public async Task<BookingResponse?> GetByReferenceAsync(string bookingReference)
    {
        return await _context.Bookings.AsNoTracking().Where(booking => booking.BookingReference == bookingReference).Select(booking => new BookingResponse
        {
            BookingReference = booking.BookingReference,
            CustomerName = booking.CustomerName,
            Email = booking.Email,
            SeatCount = booking.SeatCount,
            Status = booking.Status,
            CreatedAtUtc = booking.CreatedAtUtc,
            CancelledAtUtc = booking.CancelledAtUtc,
            Session = new BookingSessionResponse
            {
                Id = booking.Session.Id,
                StartTime = booking.Session.StartTime,
                EndTime = booking.Session.EndTime,
                SessionType = booking.Session.SessionType,
                Space = new BookingSpaceResponse
                {
                    Id = booking.Session.Space.Id,
                    Name = booking.Session.Space.Name,
                    Slug = booking.Session.Space.Slug,
                    Aura = booking.Session.Space.Aura,
                    LofiStyle = booking.Session.Space.LofiStyle
                }
            }

        }).FirstOrDefaultAsync();
    }


    public async Task<BookingResponse> CancelAsync(string bookingReference)
    {
        var booking = await _context.Bookings.Include(booking => booking.Session).ThenInclude(session => session.Space).FirstOrDefaultAsync(booking => booking.BookingReference == bookingReference);

        if (booking is null)
        {
            throw new KeyNotFoundException("Booking not found.");
        }

        if (booking.Status == BookingStatus.Cancelled)
        {
            throw new InvalidOperationException("This booking has already been cancelled.");
        }

        booking.Status = BookingStatus.Cancelled;
        booking.CancelledAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(booking, booking.Session);
    }


    private async Task<string> GenerateBookingReferenceAsync()
    {
        const string characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        string reference;

        do
        {
            reference = new string(Enumerable.Range(0,8).Select(_ => characters[RandomNumberGenerator.GetInt32(characters.Length)]).ToArray());
        }
        while (await _context.Bookings.AnyAsync(booking => booking.BookingReference == reference));

        return reference;
    }

    private static BookingResponse MapToResponse(Booking booking, Session session)
    {
        return new BookingResponse
        {
            BookingReference = booking.BookingReference,
            CustomerName = booking.CustomerName,
            Email = booking.Email,
            SeatCount = booking.SeatCount,
            Status = booking.Status,
            CreatedAtUtc = booking.CreatedAtUtc,
            CancelledAtUtc = booking.CancelledAtUtc,
            Session = new BookingSessionResponse
            {
                Id = session.Id,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                SessionType = session.SessionType,
                Space = new BookingSpaceResponse
                {
                    Id = session.Space.Id,
                    Name = session.Space.Name,
                    Slug = session.Space.Slug,
                    Aura = session.Space.Aura,
                    LofiStyle = session.Space.LofiStyle
                }
            }
        };
    }
}