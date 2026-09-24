namespace Fidora.Api.Models;

public class Booking
{
    public int Id { get; set; }

    public string BookingReference { get; set; } = string.Empty;

    public int SessionId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public int SeatCount { get; set; }

    public BookingStatus Status { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime? CancelledAtUtc { get; set; }

    public Session Session { get; set; } = null!;
}