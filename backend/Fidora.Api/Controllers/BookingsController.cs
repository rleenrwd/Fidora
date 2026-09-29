using Fidora.Api.DTOs;
using Fidora.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fidora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly BookingService _bookingService;

    public BookingsController(BookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<ActionResult<BookingResponse>> Create(CreateBookingRequest request)
    {
        try
        {
            var booking = await _bookingService.CreateAsync(request);

            return CreatedAtAction(nameof(GetByReference), new {bookingReference = booking.BookingReference}, booking);
        } 
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Session not found",
                Detail = ex.Message,
                Status = StatusCodes.Status404NotFound
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid booking request",
                Detail = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Booking conflict",
                Detail = ex.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
    }


    [HttpGet("{bookingReference}")]
    public async Task<ActionResult<BookingResponse>> GetByReference(string bookingReference)
    {
        var booking = await _bookingService.GetByReferenceAsync(bookingReference);

        if (booking is null)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Booking not found",
                Detail = "No booking was found with that reference.",
                Status = StatusCodes.Status404NotFound
            });
        }

        return Ok(booking);
    }


    [HttpPost("{bookingReference}/cancel")]
    public async Task<ActionResult<BookingResponse>> Cancel(string bookingReference)
    {
        try
        {
            var booking = await _bookingService.CancelAsync(bookingReference);
            return Ok(booking);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Booking not found",
                Detail = ex.Message,
                Status = StatusCodes.Status404NotFound
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Cancellation conflict",
                Detail = ex.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
    }

}