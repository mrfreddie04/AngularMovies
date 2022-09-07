using Microsoft.AspNetCore.Http;
using Movies.DTOs;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Helpers
{
  public static class IQueryableExtensions
  {
    public static IQueryable<T> Paginate<T>(this IQueryable<T> queryable, PaginationDTO paginationDTO)
    {
      return queryable
        .Skip((paginationDTO.PageNumber - 1) * paginationDTO.PageSize)
        .Take(paginationDTO.PageSize);
    }
  }
}
