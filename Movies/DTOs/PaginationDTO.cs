namespace Movies.DTOs
{
  public class PaginationDTO
  {
    private int _pageSize = 5;
    private readonly int _maxPageSize = 50;

    public int PageNumber { get; set; } = 1;
    public int PageSize 
    { 
      get => _pageSize;
      set => _pageSize = value > _maxPageSize ? _maxPageSize : value;            
    }
  }
}
