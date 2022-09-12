using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Movies.DTOs;
using Movies.Entities;
using Movies.Filters;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
  public class GenresController : ControllerBase
  {
    private readonly ILogger<GenresController> _logger;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GenresController(
      ILogger<GenresController> logger,
      ApplicationDbContext context,
      IMapper mapper
    )
    {
      _logger = logger;
      _context = context;
      _mapper = mapper;
    }

    [HttpGet] // /api/genres
    //[ResponseCache(Duration = 60)]
    //[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    //[ServiceFilter(typeof(MyActionFilter))]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<GenreDTO>>> Get()
    {
      _logger.LogInformation("Getting all the genres");
      var genres = await _context.Genres.OrderBy(genre => genre.Name).ToListAsync();
      var genresDTOs = _mapper.Map<IEnumerable<GenreDTO>>(genres);
      return Ok(genresDTOs);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<GenreDTO>> GetById([FromRoute] int id)
    {
      var genre = await _context.Genres.FindAsync(id);
      if(genre == null) 
      {
        return BadRequest("Genre not found");
      }
      var genreDTO = _mapper.Map<GenreDTO>(genre);     
      return Ok(genreDTO);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] GenreCreateDTO genreCreateDTO)
    {
      var genre = _mapper.Map<Genre>(genreCreateDTO);
      _context.Genres.Add(genre);
      var count = await _context.SaveChangesAsync();
      
      return count > 0 
       ? NoContent()
       : BadRequest("There was an error creating genre");
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromBody] GenreCreateDTO genreCreateDTO)
    {
      var genre = _mapper.Map<Genre>(genreCreateDTO);
      genre.Id = id;
      _context.Entry(genre).State = EntityState.Modified;

      var count = await _context.SaveChangesAsync();
      return count > 0
       ? NoContent()
       : BadRequest("There was an error updating genre");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
      var genre = await _context.Genres.FindAsync(id);
      if (genre == null)
      {
        return BadRequest("Genre not found");
      }
      _context.Genres.Remove(genre);
      var count = await _context.SaveChangesAsync();
      return count > 0
       ? NoContent()
       : BadRequest("There was an error deleting genre");
    }
  }
}


