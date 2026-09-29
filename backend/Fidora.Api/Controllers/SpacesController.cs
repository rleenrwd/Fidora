using Fidora.Api.DTOs;
using Fidora.Api.Services;
using Microsoft.AspNetCore.Mvc;


namespace Fidora.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpacesController : ControllerBase
{
    private readonly SpaceService _spaceService;

    public SpacesController(SpaceService spaceService)
    {
        _spaceService = spaceService;
    }

    [HttpGet]
    public async Task<ActionResult<List<SpaceResponse>>> GetAll()
    {
        var spaces = await _spaceService.GetAllAsync();
        return Ok(spaces);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SpaceResponse>> GetById(int id)
    {
        var space = await _spaceService.GetByIdAsync(id);

        if (space is null)
        {
            return NotFound();
        }

        return Ok(space);
    }

}