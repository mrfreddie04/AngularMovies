using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using System;
using System.Threading.Tasks;
using System.Reflection.Metadata;

namespace Movies.Helpers
{
  public class InAppStorageService : IFileStorageService
  {
    private readonly IWebHostEnvironment _env;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public InAppStorageService(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
      _env = env;
      _httpContextAccessor = httpContextAccessor;
    }

    public Task DeleteFile(string containerName, string fileRoute)
    {
      //if actor does not have a picture
      if (string.IsNullOrEmpty(fileRoute)) return Task.CompletedTask;

      //Extract filename
      var fileName = Path.GetFileName(fileRoute);

      //get O/S Path
      var fullPath = Path.Combine(_env.WebRootPath, containerName, fileName);
      if(File.Exists(fullPath))
      {
        File.Delete(fullPath);
      }
      
      return Task.CompletedTask;
    }

    public async Task<string> EditFile(string containerName, IFormFile file, string fileRoute)
    {
      await DeleteFile(containerName, fileRoute);
      return await SaveFile(containerName, file);
    }

    public async Task<string> SaveFile(string containerName, IFormFile file)
    {
      if (file == null) return "";

      //randomize file name - but preserve file extension
      var extension = Path.GetExtension(file.FileName);
      var fileName = $"{Guid.NewGuid()}{extension}";

      //get folder
      string folder = Path.Combine(_env.WebRootPath, containerName);
      if(!Directory.Exists(folder))
      {
        Directory.CreateDirectory(folder);
      }

      //get URL
      string route = Path.Combine(folder, fileName);
      //upload file
      using(var ms = new MemoryStream()) 
      {
        await file.CopyToAsync(ms);
        var content = ms.ToArray();
        await File.WriteAllBytesAsync(route, content);
      }

      //return url of the blob
      var url = $"{_httpContextAccessor.HttpContext.Request.Scheme}://{_httpContextAccessor.HttpContext.Request.Host}";
      var routeForDB = Path.Combine(url, containerName, fileName).Replace("\\","/");
      return routeForDB;
    }
  }
}
