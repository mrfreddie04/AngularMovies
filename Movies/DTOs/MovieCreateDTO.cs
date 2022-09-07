using System.ComponentModel.DataAnnotations;
using System;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Movies.Helpers;

namespace Movies.DTOs
{
  public class MovieCreateDTO
  {
    [Required]
    [StringLength(maximumLength: 75)]
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Trailer { get; set; }
    public bool InTheaters { get; set; }
    public DateTime ReleaseDate { get; set; }
    public IFormFile Poster { get; set; }

    [ModelBinder(BinderType = typeof(TypeBinder<List<int>>))]
    public List<int> GenreIds { get; set; }

    [ModelBinder(BinderType = typeof(TypeBinder<List<int>>))]
    public List<int> TheaterIds { get; set; }

    [ModelBinder(BinderType = typeof(TypeBinder<List<MovieActorCreateDTO>>))]
    public List<MovieActorCreateDTO> Actors { get; set; }
  }
}
