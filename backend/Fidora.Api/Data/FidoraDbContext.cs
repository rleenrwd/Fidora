using Fidora.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Fidora.Api.Data;

public class FidoraDbContext : DbContext
{
    public FidoraDbContext(DbContextOptions<FidoraDbContext> options) : base(options) // :base(options) says to call the base/parent class's (DbContext) constructor and pass the options
    {
        
    }

    public DbSet<Space> Spaces => Set<Space>();

    public DbSet<Session> Sessions => Set<Session>();

    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Space>(entity =>
        {
            entity.HasKey(space => space.Id);

            entity.Property(space => space.Name).IsRequired().HasMaxLength(100);

            entity.Property(space => space.Slug).IsRequired().HasMaxLength(80);

            entity.Property(space => space.Description).IsRequired().HasMaxLength(500);

            entity.Property(space => space.Aura).IsRequired().HasMaxLength(80);

            entity.Property(space => space.LofiStyle).IsRequired().HasMaxLength(80);

            entity.Property(space => space.ImageUrl).IsRequired().HasMaxLength(500);

            entity.HasIndex(space => space.Slug).IsUnique();

            entity.HasMany(space => space.Sessions).WithOne(session => session.Space).HasForeignKey(session => session.SpaceId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(session => session.Id);

            entity.Property(session => session.SessionType).HasConversion<string>();

            entity.HasIndex(session => new
            {
                session.SpaceId,
                session.StartTime
            });

            entity.HasMany(session => session.Bookings).WithOne(booking => booking.Session).HasForeignKey(booking => booking.SessionId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(booking => booking.Id);

            entity.Property(booking => booking.BookingReference).IsRequired().HasMaxLength(12);

            entity.Property(booking => booking.CustomerName).IsRequired().HasMaxLength(120);

            entity.Property(booking => booking.Email).IsRequired().HasMaxLength(254);

            entity.Property(booking => booking.Status).HasConversion<string>();

            entity.HasIndex(booking => booking.BookingReference).IsUnique();

            entity.HasIndex(booking => booking.SessionId);
        });
    }
}