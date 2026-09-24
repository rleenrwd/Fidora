namespace Fidora.Api.Models;

public class Session
{
    public int Id {get;set;}

    public int SpaceId {get;set;}

    public DateTimeOffset StartTime {get;set;}

    public DateTimeOffset EndTime {get;set;}

    public int Capacity {get;set;}

    public SessionType SessionType {get;set;}

    public Space Space {get;set;} = null!;

    public ICollection<Booking> Bookings {get;set;} = new List<Booking>();
}