using System.ComponentModel.DataAnnotations;

namespace Movies.DTOs
{
  public class TheaterDTO
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
  }
}
