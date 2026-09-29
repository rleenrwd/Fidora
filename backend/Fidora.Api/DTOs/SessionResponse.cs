using Fidora.Api.Models;

namespace Fidora.Api.DTOs;

public class SessionResponse
{
    public int Id { get; set; }

    public int SpaceId { get; set; }

    public DateTimeOffset StartTime { get; set; }

    public DateTimeOffset EndTime { get; set; }

    public int Capacity { get; set; }

    public int RemainingSeats { get; set; }

    public SessionType SessionType { get; set; }
}