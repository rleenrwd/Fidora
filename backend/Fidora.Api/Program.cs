using Fidora.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<FidoraDbContext>(options => 
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("FidoraDatabase")));
    

var app = builder.Build();

app.UseHttpsRedirection();

app.MapControllers();

app.Run();