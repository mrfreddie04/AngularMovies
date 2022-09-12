using System.ComponentModel.DataAnnotations;
using System;
using Movies.Entities;
using System.Collections.Generic;

namespace Movies.DTOs
{
  public class MovieDTO
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Trailer { get; set; }
    public bool InTheaters { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string Poster { get; set; }
    public double AverageVote { get; set; }
    public int UserVote { get; set; }

    public List<GenreDTO> Genres { get; set; }
    public List<ActorMovieDTO> Actors { get; set; }
    public List<TheaterDTO> Theaters { get; set; }
  }
}
