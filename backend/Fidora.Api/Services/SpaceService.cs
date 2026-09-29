using System.Data.Common;
using System.Diagnostics;
using Fidora.Api.Data;
using Fidora.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Services;

public class SpaceService
{
    private readonly FidoraDbContext _context;

    public SpaceService(FidoraDbContext context)
    {
        _context = context;
    }

    public async Task<List<SpaceResponse>> GetAllAsync()
    {
        return await _context.Spaces
            .AsNoTracking()
            .Select(space => new SpaceResponse
            {
                Id = space.Id,
                Name = space.Name,
                Slug = space.Slug,
                Description = space.Description,
                Aura = space.Aura,
                LofiStyle = space.LofiStyle,
                Capacity = space.Capacity,
                ImageUrl = space.ImageUrl

            }).ToListAsync();
    }

    public async Task<SpaceResponse?> GetByIdAsync(int id)
    {
        return await _context.Spaces
            .AsNoTracking()
            .Where(space => space.Id == id)
            .Select(space => new SpaceResponse 
            {
                Id = space.Id,
                Name = space.Name,
                Slug = space.Slug,
                Description = space.Description,
                Aura = space.Aura,
                LofiStyle = space.LofiStyle,
                Capacity = space.Capacity,
                ImageUrl = space.ImageUrl
            
        }).FirstOrDefaultAsync();
    }








}