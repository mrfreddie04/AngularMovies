using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Movies.Filters;
using Movies.Helpers;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Movies
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddDbContext<ApplicationDbContext>(options =>
      {
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"),
          sqlOptions => sqlOptions.UseNetTopologySuite());
      });

      //services.AddIdentity<IdentityUser, IdentityRole>()
      //    .AddEntityFrameworkStores<ApplicationDbContext>()
      //    .AddDefaultTokenProviders();

      services.AddIdentityCore<IdentityUser>()
          .AddEntityFrameworkStores<ApplicationDbContext>()
          .AddSignInManager<SignInManager<IdentityUser>>();


      services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
          options.TokenValidationParameters = new TokenValidationParameters()
          {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true, //token expiration
            ValidateIssuerSigningKey = true, //verify JWT validity thru the signing KEY
            IssuerSigningKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(Configuration.GetValue<string>("JwtKey"))),
            ClockSkew = TimeSpan.Zero
          };
        });

      services.AddAuthorization(options => 
      {
        options.AddPolicy("IsAdmin", policy => policy.RequireClaim("role", "admin"));
      });

      services.AddCors(options =>
      {
        options.AddDefaultPolicy(builder =>
        {
          var clientUrl = Configuration.GetValue<string>("ClientUrl");
          builder.WithOrigins(clientUrl)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("totalCount");
        });
      });

      services.AddAutoMapper(typeof(Startup));
      //Add GeometryFactory to DI
      services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));
      //Configure AutoMapperProfile on DI, by default it is instantiated w/out args
      //We set it here to accept GeometryFactory as a param - we fetch its instance from DI container 
      //(GetService method) 
      services.AddSingleton(provider => new MapperConfiguration( config =>
      {
        var geometryFactory = provider.GetService<GeometryFactory>();
        config.AddProfile(new AutoMapperProfiles(geometryFactory));
      }).CreateMapper());

      

      //services.AddScoped<IFileStorageService, AzureStorageService>();
      services.AddScoped<IFileStorageService, InAppStorageService>();
      services.AddHttpContextAccessor();

      services.AddControllers(options =>
      {
        options.Filters.Add(typeof(MyExceptionFilter));
      });

      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Movies", Version = "v1" });
      });

    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Movies v1"));
      }

      app.UseHttpsRedirection();

      app.UseStaticFiles();

      app.UseRouting();

      app.UseCors();

      app.UseAuthentication();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
