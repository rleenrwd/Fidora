using Fidora.Api.Models;
using Microsoft.Net.Http.Headers;

namespace Fidora.Api.DTOs;

public class BookingResponse
{
    public string BookingReference {get;set;} = string.Empty;

    public string CustomerName {get;set;} = string.Empty;

    public string Email {get;set;} = string.Empty;

    public int SeatCount {get;set;}

    public BookingStatus Status {get;set;}

    public DateTime CreatedAtUtc {get;set;}

    public DateTime? CancelledAtUtc {get;set;}

    public BookingSessionResponse Session {get;set;} = new();
}


public class BookingSessionResponse
{
    public int Id {get;set;}

    public DateTimeOffset StartTime {get;set;}

    public DateTimeOffset EndTime {get;set;}

    public SessionType SessionType {get;set;}

    public BookingSpaceResponse Space {get;set;} = new();
}

public class BookingSpaceResponse
{
    public int Id {get;set;}

    public string Name {get;set;} = string.Empty;

    public string Slug {get;set;} = string.Empty;

    public string Aura {get;set;} = string.Empty;

    public string LofiStyle {get;set;} = string.Empty;
}