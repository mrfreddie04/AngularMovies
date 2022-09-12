using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.DTOs;
using Movies.Entities;
using Movies.Helpers;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
  public class ActorsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IFileStorageService _fileStorageService;
    private readonly string ContainerName = "actors"; 

    public ActorsController(
      ApplicationDbContext context,
      IMapper mapper,
      IFileStorageService fileStorageService
    )
    {
      _context = context;
      _mapper = mapper;
      _fileStorageService = fileStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ActorDTO>>> GetAll([FromQuery] PaginationDTO paginationDTO)
    {
      var queryable = _context.Actors.AsQueryable();
      await HttpContext.AddPaginationHeaders(queryable);

      var actors = await queryable
        .OrderBy(actor => actor.Name)
        .Paginate(paginationDTO)
        .ToListAsync();
      var actorsDTO = _mapper.Map<IEnumerable<ActorDTO>>(actors);
      return Ok(actorsDTO);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ActorDTO>> GetById([FromRoute] int id)
    {
      var actor = await _context.Actors.FindAsync(id);
      if(actor == null)
      {
        return BadRequest("Actor not found");
      }
      var actorDTO = _mapper.Map<ActorDTO>(actor);
      return Ok(actorDTO);
    }

    [HttpPost("search-by-name")]
    public async Task<ActionResult<IEnumerable<ActorMovieDTO>>> SearchByName([FromBody] string name)
    {
      if (string.IsNullOrWhiteSpace(name)) 
      {
        return Ok(new List<ActorMovieDTO>());
      }

      var actors = await _context.Actors
        .Where(actor => actor.Name.Contains(name))
        .OrderBy(actor => actor.Name)
        .Select(actor => new ActorMovieDTO() { Id=actor.Id, Name = actor.Name, Picture = actor.Picture})
        .Take(5)
        .ToListAsync();

      return Ok(actors);
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromForm] ActorCreateDTO actorCreateDTO)
    {
      var actor = _mapper.Map<Actor>(actorCreateDTO);

      if(actorCreateDTO.Picture != null)
      {
        //store the file to file storage and return URL
        actor.Picture = await _fileStorageService.SaveFile(ContainerName, actorCreateDTO.Picture);
      }

      _context.Actors.Add(actor);
      var count = await _context.SaveChangesAsync();

      return count > 0
       ? NoContent()
       : BadRequest("There was an error creating actor");
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, [FromForm] ActorCreateDTO actorCreateDTO)
    {
      var actor = await _context.Actors.FindAsync(id);
      if(actor == null)
      {
        return BadRequest("Actor not found");
      }
      actor = _mapper.Map(actorCreateDTO, actor); //updates, does not override

      if (actorCreateDTO.Picture != null)
      {
        actor.Picture = await _fileStorageService.EditFile(
          ContainerName, actorCreateDTO.Picture, actor.Picture);
      }

      var count = await _context.SaveChangesAsync();
      return count > 0
       ? NoContent()
       : BadRequest("There was an error updating actor");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
      var actor = await _context.Actors.FindAsync(id);
      if (actor == null)
      {
        return BadRequest("Actor not found");
      }

      _context.Actors.Remove(actor);
      var count = await _context.SaveChangesAsync();
      if(count == 0)
      {
        return BadRequest("There was an error deletin actor");
      } 
       
      await _fileStorageService.DeleteFile(ContainerName, actor.Picture);

      return NoContent();
    }
  }
}
