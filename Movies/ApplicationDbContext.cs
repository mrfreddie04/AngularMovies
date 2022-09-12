using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using Movies.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Movies
{
  public class ApplicationDbContext : IdentityDbContext
  {
    public ApplicationDbContext([NotNullAttribute] DbContextOptions options) : base(options)
    {
    }

    public DbSet<Genre> Genres { get; set; }
    public DbSet<Actor> Actors { get; set; }
    public DbSet<Theater> Theaters { get; set; }
    public DbSet<Movie> Movies { get; set; }
    public DbSet<MovieActor> MoviesActors { get; set; }
    public DbSet<MovieGenre> MoviesGenres { get; set; }
    public DbSet<MovieTheater> MoviesTheaters { get; set; }
    public DbSet<Rating> Ratings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<MovieActor>().HasKey(p => new { p.MovieId, p.ActorId });
      modelBuilder.Entity<MovieGenre>().HasKey(p => new { p.MovieId, p.GenreId });
      modelBuilder.Entity<MovieTheater>().HasKey(p => new { p.MovieId, p.TheaterId });

      //needed for Identity System!!!
      base.OnModelCreating(modelBuilder);
    }

  }
}
