using System.Collections.Generic;

namespace Movies.DTOs
{
  public class MoviePutGetDTO
  {
    public MovieDTO Movie { get; set; }
    public List<GenreDTO> SelectedGenres { get; set; }
    public List<GenreDTO> NonSelectedGenres { get; set; }
    public List<TheaterDTO> SelectedTheaters { get; set; }
    public List<TheaterDTO> NonSelectedTheaters { get; set; }
    public List<ActorMovieDTO> Actors { get; set; }
  }
}
