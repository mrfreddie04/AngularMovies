using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using Movies.DTOs;
using Movies.Entities;
using Movies.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;

namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
  public class MoviesController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;
    private readonly string ContainerName = "posters";

    public MoviesController(
      ApplicationDbContext context,
      UserManager<IdentityUser> userManager,
      IMapper mapper,
      IFileStorageService fileStorageService
    )
    {
      _context = context;
      _userManager = userManager;
      _mapper = mapper;
      _fileStorageService = fileStorageService;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<HomeDTO>> Get()
    {
      var top = 6;
      var today = DateTime.Today;

      var upcomingReleases = await _context.Movies
                                .Where(movie => movie.ReleaseDate > today)
                                .OrderBy(movie => movie.ReleaseDate)  
                                .Take(top)
                                .ToListAsync();
      var inTheaters = await _context.Movies
                                .Where(movie => movie.InTheaters)
                                .OrderBy(movie => movie.ReleaseDate)
                                .Take(top)
                                .ToListAsync();
      var homeDTO = new HomeDTO();
      homeDTO.UpcomingReleases = _mapper.Map<List<MovieDTO>>(upcomingReleases);
      homeDTO.InTheaters = _mapper.Map<List<MovieDTO>>(inTheaters);

      return Ok(homeDTO);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<MovieDTO>> GetById([FromRoute] int id)
    {
      var movie = await _context.Movies
                    .Include(m => m.MoviesGenres).ThenInclude(mg => mg.Genre)
                    .Include(m => m.MoviesTheaters).ThenInclude(mt => mt.Theater)
                    .Include(m => m.MoviesActors).ThenInclude(ma => ma.Actor)
                    .FirstOrDefaultAsync(m => m.Id == id);
      
      if (movie == null)
      {
        return BadRequest("Movie not found");
      }

      var averageVote = 0.0;
      var userVote = 0;

      if(await _context.Ratings.AnyAsync( rating => rating.MovieId == id)) 
      {
        averageVote = await _context.Ratings.Where(rating => rating.MovieId == id)
          .AverageAsync(rating => rating.Rate);

        if(HttpContext.User.Identity.IsAuthenticated)
        {
          var email = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "email").Value;
          var user = await _userManager.FindByEmailAsync(email);
          var userId = user.Id;
          var ratingDb = await _context.Ratings.FirstOrDefaultAsync(
            rating => rating.MovieId == id && rating.UserId == userId);
          if(ratingDb != null)
          {
            userVote = ratingDb.Rate;
          }          
        }        
      }

      var movieDTO = _mapper.Map<MovieDTO>(movie);
      movieDTO.AverageVote = averageVote;
      movieDTO.UserVote = userVote;
      movieDTO.Actors = movieDTO.Actors.OrderBy(a => a.Order).ToList();

      return Ok(movieDTO);
    }

    [HttpGet("filter")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<MovieDTO>>> GetFilter([FromQuery] FilterMovieDTO filterMovieDTO)
    {
      var query = _context.Movies.AsQueryable();
      if (!string.IsNullOrEmpty(filterMovieDTO.Title))
      {
        query = query.Where(m => m.Title.Contains(filterMovieDTO.Title));
      }
      if (filterMovieDTO.InTheaters)
      {
        query = query.Where(m => m.InTheaters);
      }
      if (filterMovieDTO.UpcomingReleases)
      {
        var today = DateTime.Today;
        query = query.Where(m => m.ReleaseDate > today);
      }
      if (filterMovieDTO.GenreId > 0)
      {
        //query = query.Where(m => m.MoviesGenres.Any(g => g.GenreId == filterMovieDTO.GenreId));
        query = query.Where(m => m.MoviesGenres.Select(g => g.GenreId).Contains(filterMovieDTO.GenreId));
      }

      //insert totalcount into HttpResonse Header
      await HttpContext.AddPaginationHeaders(query);

      var movies = await query
        .OrderBy(movie => movie.Title)
        .Paginate(filterMovieDTO.PaginationDTO)
        .ToListAsync();

      return Ok(_mapper.Map<IEnumerable<MovieDTO>>(movies));
    }

    [HttpGet("postget")]
    public async Task<ActionResult<MoviePostGetDTO>> PostGet()
    {
      var theaters = await _context.Theaters.OrderBy(theater => theater.Name).ToListAsync();
      var genres = await _context.Genres.OrderBy(genre => genre.Name).ToListAsync();
      var theatersDTO = _mapper.Map<List<TheaterDTO>>(theaters);
      var genresDTO = _mapper.Map<List<GenreDTO>>(genres);
      MoviePostGetDTO moviePostGetDTO = new() { Genres = genresDTO, Theaters = theatersDTO };
      return Ok(moviePostGetDTO);
    }

    [HttpGet("putget/{id:int}")]
    public async Task<ActionResult<MoviePutGetDTO>> PutGet([FromRoute] int id)
    {
      var movieActionResult = await GetById(id);
      if(movieActionResult.Result is not OkObjectResult)
      {
        return BadRequest("Movie not found");
      }
    
      var result = movieActionResult.Result as OkObjectResult;
      var movieDTO = result.Value as MovieDTO;
      var genresSelectedIds = movieDTO.Genres.Select(g => g.Id).ToList();
      var theatersSelectedIds = movieDTO.Theaters.Select(t => t.Id).ToList();
      var actorsSelectedIds = movieDTO.Actors.Select(a => a.Id).ToList();

      var nonSelectedGenres = await _context.Genres
        .Where(g => !genresSelectedIds.Contains(g.Id))
        .OrderBy(g => g.Name).ToListAsync();

      var nonSelectedTheaters = await _context.Theaters
        .Where(t => !theatersSelectedIds.Contains(t.Id))
        .OrderBy(t => t.Name).ToListAsync();

      var moviePutGetDTO = new MoviePutGetDTO();
      moviePutGetDTO.Movie = movieDTO;
      moviePutGetDTO.SelectedGenres = movieDTO.Genres;
      moviePutGetDTO.NonSelectedGenres = _mapper.Map<List<GenreDTO>>(nonSelectedGenres);
      moviePutGetDTO.SelectedTheaters = movieDTO.Theaters;
      moviePutGetDTO.NonSelectedTheaters = _mapper.Map<List<TheaterDTO>>(nonSelectedTheaters);
      moviePutGetDTO.Actors = movieDTO.Actors;

      return Ok(moviePutGetDTO);
      
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromForm] MovieCreateDTO movieCreateDTO)
    {
      var movie = _mapper.Map<Movie>(movieCreateDTO);
      if (movieCreateDTO.Poster != null)
      {
        //store the file to file storage and return URL
        movie.Poster = await _fileStorageService.SaveFile(ContainerName, movieCreateDTO.Poster);
      }
      AnnotateActorsOrder(movie);

      _context.Movies.Add(movie);

      var count = await _context.SaveChangesAsync();
      return count > 0
       ? Ok(movie.Id)
       : BadRequest("There was an error creating movie");
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update([FromRoute] int id, [FromForm] MovieCreateDTO movieCreateDTO)
    {
      //Get movie with all relationships
      // we need these properties populated to be able to update them from DTO (via AutoMapper)
      // EF needs to track related data
      var movie = await _context.Movies
                    .Include(m => m.MoviesGenres).ThenInclude(mg => mg.Genre)
                    .Include(m => m.MoviesTheaters).ThenInclude(mt => mt.Theater)
                    .Include(m => m.MoviesActors).ThenInclude(ma => ma.Actor)
                    .FirstOrDefaultAsync(m => m.Id == id);                    
      if (movie == null)
      {
        return BadRequest("Movie not found");
      }

      movie = _mapper.Map(movieCreateDTO, movie); //updates, does not override

      if (movieCreateDTO.Poster != null)
      {
        //store the file to file storage and return URL
        movie.Poster = await _fileStorageService.EditFile(ContainerName, 
            movieCreateDTO.Poster, movie.Poster);
      }      
      
      AnnotateActorsOrder(movie);

      var count = await _context.SaveChangesAsync();
      return count > 0
       ? NoContent()
       : BadRequest("There was an error updating movie");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete([FromRoute] int id) 
    {
      var movie = await _context.Movies.FindAsync(id);
      if (movie == null)
      {
        return BadRequest("Movie not found");
      }

      _context.Movies.Remove(movie);
      var count = await _context.SaveChangesAsync();
      await _fileStorageService.DeleteFile(ContainerName, movie.Poster);

      return count > 0
       ? NoContent()
       : BadRequest("There was an error delete movie");
    }

    private void AnnotateActorsOrder(Movie movie) 
    { 
      if(movie.MoviesActors != null)
      {
        for(int i = 0; i < movie.MoviesActors.Count; i++) 
        {
          movie.MoviesActors[i].Order = i;
        }
      }
    }

  }
}
