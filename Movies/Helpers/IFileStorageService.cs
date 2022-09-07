using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Movies.Helpers
{
  public interface IFileStorageService
  {
    Task DeleteFile(string containerName, string fileRoute);
    Task<string> SaveFile(string containerName, IFormFile form);
    Task<string> EditFile(string containerName, IFormFile form, string fileRoute);
  }
}
