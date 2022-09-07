using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Movies.Entities
{
  public class Movie
  {
    public int Id { get; set; }
    [Required]
    [StringLength(maximumLength: 75)]
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Trailer { get; set; }
    public bool InTheaters { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Poster { get; set; }

    public IList<MovieGenre> MoviesGenres { get; set; }
    public IList<MovieActor> MoviesActors { get; set; }
    public IList<MovieTheater> MoviesTheaters { get; set; }

  }
}
