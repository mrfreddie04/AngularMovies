using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Movies.Entities
{
  public class Actor
  {
    public int Id { get; set; }
    [Required]
    [StringLength(120)]
    public string Name { get; set; }
    public DateTime DateOfBirth { get; set; }
    public string Biography { get; set; }
    public string Picture { get; set; }

    public ICollection<MovieActor> MoviesActors { get; set; }
  }
}
