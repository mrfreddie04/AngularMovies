using AutoMapper.Configuration;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;
using IConfiguration = Microsoft.Extensions.Configuration.IConfiguration;

namespace Movies.Helpers
{
  public class AzureStorageService : IFileStorageService
  {
    private readonly string _connectionString;

    public AzureStorageService(IConfiguration config)
    {
      _connectionString = config.GetConnectionString("AzureStorageConnection");
    }

    public async Task DeleteFile(string containerName, string fileRoute)
    {
      //if actor does not have a picture
      if (string.IsNullOrEmpty(fileRoute)) return;

      //get access to container
      var client = new BlobContainerClient(_connectionString, containerName);
      await client.CreateIfNotExistsAsync();

      //get file name
      var fileName = Path.GetFileName(fileRoute);
      //find file name in the container
      var blob = client.GetBlobClient(fileName);
      //delete
      await blob.DeleteIfExistsAsync();
    }

    public async Task<string> EditFile(string containerName, IFormFile file, string fileRoute)
    {
      await DeleteFile(containerName, fileRoute);
      return await SaveFile(containerName, file);
    }

    public async Task<string> SaveFile(string containerName, IFormFile file)
    {
      if (file == null) return "";

      //creates container
      var client = new BlobContainerClient(_connectionString, containerName);
      await client.CreateIfNotExistsAsync(); 
      client.SetAccessPolicy(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
      
      //randomize file name - but preserve file extension
      var extension = Path.GetExtension(file.FileName);     
      var fileName = $"{Guid.NewGuid()}{extension}";

      //create a blob object - append file nae to blob container uri (like a directory) 
      var blob = client.GetBlobClient(fileName);
      //upload file to the storage
      await blob.UploadAsync(file.OpenReadStream());

      //return url of the blob
      return blob.Uri.ToString();
    }
  }
}
