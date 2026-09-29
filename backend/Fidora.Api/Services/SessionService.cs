using Fidora.Api.Data;
using Fidora.Api.DTOs;
using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Services;

public class SessionService
{
    private readonly FidoraDbContext _context;

    public SessionService(FidoraDbContext context)
    {
        _context = context;
    }

    public async Task<List<SessionResponse>> GetAllAsync(
        int? spaceId = null,
        DateTimeOffset? date = null,
        SessionType? sessionType = null)
    {
        var query = _context.Sessions
            .AsNoTracking()
            .AsQueryable();

        if (spaceId.HasValue)
        {
            query = query.Where(session => session.SpaceId == spaceId.Value);
        }

        if (date.HasValue)
        {
            var start = date.Value.Date;
            var end = start.AddDays(1);

            query = query.Where(session =>
                session.StartTime >= start &&
                session.StartTime < end);
        }

        if (sessionType.HasValue)
        {
            query = query.Where(session =>
                session.SessionType == sessionType.Value);
        }

        return await query
            .OrderBy(session => session.StartTime)
            .Select(session => new SessionResponse
            {
                Id = session.Id,
                SpaceId = session.SpaceId,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Capacity = session.Capacity,
                SessionType = session.SessionType,

                RemainingSeats =
                    session.Capacity -
                    (
                        session.Bookings
                            .Where(booking =>
                                booking.Status == BookingStatus.Confirmed)
                            .Sum(booking => (int?)booking.SeatCount)
                        ?? 0
                    )
            })
            .ToListAsync();
    }

    public async Task<SessionResponse?> GetByIdAsync(int id)
    {
        return await _context.Sessions
            .AsNoTracking()
            .Where(session => session.Id == id)
            .Select(session => new SessionResponse
            {
                Id = session.Id,
                SpaceId = session.SpaceId,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Capacity = session.Capacity,
                SessionType = session.SessionType,

                RemainingSeats =
                    session.Capacity -
                    (
                        session.Bookings
                            .Where(booking =>
                                booking.Status == BookingStatus.Confirmed)
                            .Sum(booking => (int?)booking.SeatCount)
                        ?? 0
                    )
            })
            .FirstOrDefaultAsync();
    }
}