using System.Collections.Generic;

namespace Movies.DTOs
{
  public class MoviePostGetDTO
  {
    public List<GenreDTO> Genres { get; set; }
    public List<TheaterDTO> Theaters { get; set; }
  }
}
