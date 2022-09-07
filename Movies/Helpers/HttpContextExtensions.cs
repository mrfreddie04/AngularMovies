using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Helpers
{
  public static class HttpContextExtensions
  {
    public static async Task AddPaginationHeaders<T>(this HttpContext httpContext,
      IQueryable<T> queryable)
    {
      if (queryable == null)
      {
        throw new ArgumentNullException(nameof(httpContext));
      }

      var count = await queryable.CountAsync();
      httpContext.Response.Headers.Add("totalCount", count.ToString());
    }
  }
}
