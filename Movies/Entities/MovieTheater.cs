namespace Movies.Entities
{
  public class MovieTheater
  {
    public int MovieId { get; set; }
    public int TheaterId { get; set; }

    public Theater Theater { get; set; }
    public Movie Movie { get; set; }
  }
}
