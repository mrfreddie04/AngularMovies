using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Movies.DTOs;
using Movies.Entities;
using Movies.Helpers;
using System.Linq;
using System.Threading.Tasks;

namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class RatingsController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IMapper _mapper;

    public RatingsController(
      ApplicationDbContext context,
      UserManager<IdentityUser> userManager,
      IMapper mapper
    )
    {
      _context = context;
      _userManager = userManager;
      _mapper = mapper;
    }

    [HttpPost]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public async Task<ActionResult> AddRating([FromBody] RatingDTO ratingDTO) 
    {
      //get user email - from JWT
      var email = HttpContext.User.Claims.FirstOrDefault(claim => claim.Type == "email").Value;
      
      //get user id 
      var user = await _userManager.FindByEmailAsync(email);
      if(user == null) 
      {
        return BadRequest("Cannot identify the user");
      }

      //get current rate
      var currentRate = await _context.Ratings.FirstOrDefaultAsync(
        rating => rating.MovieId == ratingDTO.MovieId && rating.UserId == user.Id);

      if (currentRate == null)
      {
        var rating = new Rating()
        {
          Rate = ratingDTO.Rate,
          MovieId = ratingDTO.MovieId,
          UserId = user.Id
        };
        _context.Ratings.Add(rating);
      }
      else
      {
        currentRate.Rate = ratingDTO.Rate;
      }
      var count = await _context.SaveChangesAsync();
      return count > 0
       ? NoContent()
       : BadRequest("There was an error adding/updating movie rating");

    }
  }
}
