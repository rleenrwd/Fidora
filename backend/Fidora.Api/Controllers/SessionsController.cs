using Fidora.Api.DTOs;
using Fidora.Api.Models;
using Fidora.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Fidora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : ControllerBase
{
    private readonly SessionService _sessionService;

    public SessionsController(SessionService sessionService)
    {
        _sessionService = sessionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SessionResponse>>> GetAll(
        [FromQuery] int? spaceId,
        [FromQuery] DateTimeOffset? date,
        [FromQuery] SessionType? sessionType
    )
    {
        var sessions = await _sessionService.GetAllAsync(
            spaceId,
            date,
            sessionType
        );

        return Ok(sessions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SessionResponse>> GetById(int id)
    {
        var session = await _sessionService.GetByIdAsync(id);

        if (session is null)
        {
            return NotFound();
        }

        return Ok(session);
    }
}