using Fidora.Api.Data;
using Fidora.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<FidoraDbContext>(options => 
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("FidoraDatabase")));
    
builder.Services.AddScoped<SpaceService>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FidoraDbContext>();

    await DbSeeder.SeedAsync(context);
}


app.UseHttpsRedirection();

app.MapControllers();

app.Run();