using Movies.Entities;
using System.ComponentModel.DataAnnotations;

namespace Movies.DTOs
{
  public class RatingDTO
  {
    [Range(1, 5)]
    public int Rate { get; set; }
    public int MovieId { get; set; }
  }
}
