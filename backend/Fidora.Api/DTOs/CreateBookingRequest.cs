using System.ComponentModel.DataAnnotations;

namespace Fidora.Api.DTOs;

public class CreateBookingRequest
{
    [Range(1, int.MaxValue)]
    public int SessionId {get;set;}
    [Required]
    [StringLength(120)]
    public string CustomerName {get;set;} = string.Empty;
    [Required]
    [EmailAddress]
    [StringLength(254)]
    public string Email {get;set;} = string.Empty;
    [Range(1, int.MaxValue)]
    public int SeatCount {get;set;}
}