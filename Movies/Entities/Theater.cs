using NetTopologySuite.Geometries;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Movies.Entities
{
  public class Theater
  {
    public int Id { get; set; }

    [Required]
    [StringLength(75)]
    public string Name { get; set; }

    public Point Location { get; set; }

    public ICollection<MovieTheater> TheatersMovies { get; set; }
  }
}
