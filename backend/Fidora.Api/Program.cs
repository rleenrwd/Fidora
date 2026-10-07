using Fidora.Api.Data;
using Fidora.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(
    options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        );
    }
);

builder.Services.AddDbContext<FidoraDbContext>(options => 
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("FidoraDatabase")));
    
builder.Services.AddScoped<SpaceService>();
builder.Services.AddScoped<SessionService>();
builder.Services.AddScoped<BookingService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FidoraDbContext>();

    await DbSeeder.SeedAsync(context);
}


app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("Frontend");

app.MapControllers();

app.Run();