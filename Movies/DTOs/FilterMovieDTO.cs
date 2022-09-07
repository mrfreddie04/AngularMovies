namespace Movies.DTOs
{
  public class FilterMovieDTO
  {
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 3;
    public PaginationDTO PaginationDTO 
    {
      get => new() { PageNumber = PageNumber, PageSize = PageSize }; 
    }
    public string Title { get; set; }
    public int GenreId { get; set; }
    public bool InTheaters { get; set; }
    public bool UpcomingReleases { get; set; }
  }
}
