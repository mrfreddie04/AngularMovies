using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.DTOs;
using Movies.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
  public class TheatersController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public TheatersController(ApplicationDbContext context, IMapper mapper)
    {
      _context = context;
      _mapper = mapper;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TheaterDTO>>> Get()
    {
      var theaters = await _context.Theaters.OrderBy(theater => theater.Name).ToListAsync();
      return Ok(_mapper.Map<IEnumerable<TheaterDTO>>(theaters));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TheaterDTO>> GetById([FromRoute] int id)
    {
      var theater = await _context.Theaters.FindAsync(id);
      if (theater == null)
      {
        return BadRequest("Theater not found");
      }
      return Ok(_mapper.Map<TheaterDTO>(theater));
    }

    [HttpPost]
    public async Task<ActionResult> Create([FromBody] TheaterCreateDTO theaterCreateDTO)
    {
      var theater = _mapper.Map<Theater>(theaterCreateDTO);

      _context.Theaters.Add(theater);
      var count = await _context.SaveChangesAsync();

      return count > 0
       ? NoContent()
       : BadRequest("There was an error creating theater");
    }


    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update([FromRoute] int id, [FromBody] TheaterCreateDTO theaterCreateDTO)
    {
      var theater = await _context.Theaters.FindAsync(id);
      if (theater == null)
      {
        return BadRequest("Theater not found");
      }
      _mapper.Map(theaterCreateDTO, theater); //mapping to the EXISTING destination

      var count = await _context.SaveChangesAsync();

      return count > 0
       ? NoContent()
       : BadRequest("There was an error updating theater");
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete([FromRoute] int id)
    {
      var theater = await _context.Theaters.FindAsync(id);
      if (theater == null)
      {
        return BadRequest("Theater not found");
      }
      _context.Theaters.Remove(theater);
      var count = await _context.SaveChangesAsync();

      return count > 0
       ? NoContent()
       : BadRequest("There was an error deleting theater");
    }
  }
}
