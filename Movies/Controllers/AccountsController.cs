using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Movies.DTOs;
using Movies.Helpers;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace Movies.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class AccountsController : ControllerBase
  {
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public AccountsController(
      UserManager<IdentityUser> userManager,
      SignInManager<IdentityUser> signInManager,
      ApplicationDbContext context,
      IMapper mapper,
      IConfiguration configuration)   
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _context = context;
      _mapper = mapper;
      _configuration = configuration;
    }

    [HttpGet("list-users")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetListUsers([FromQuery] PaginationDTO paginationDTO)
    {
      var queryable = _context.Users.AsQueryable();
      await HttpContext.AddPaginationHeaders(queryable);

      var users = await queryable
        .OrderBy(user => user.Email)
        .Paginate(paginationDTO)
        .ToListAsync();

      var usersDTO = _mapper.Map<IEnumerable<UserDTO>>(users);
      return Ok(usersDTO);
    }

    [HttpPost("make-admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> MakeAdmin([FromBody] string userId)
    {
      var user = await _userManager.FindByIdAsync(userId);
      await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
      return NoContent();
    }

    [HttpPost("remove-admin")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
    public async Task<ActionResult> RemoveAdmin([FromBody] string userId)
    {
      var user = await _userManager.FindByIdAsync(userId);
      await _userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
      return NoContent();
    }

    [HttpPost("create")]
    public async Task<ActionResult<AuthenticationResponse>> Create([FromBody] UserCredentials userCredentials)
    {
      var user = new IdentityUser() 
      { 
        UserName = userCredentials.Email, 
        Email = userCredentials.Email 
      };
      var result = await _userManager.CreateAsync(user, userCredentials.Password);

      if (!result.Succeeded) 
      { 
        return BadRequest(result.Errors);
      }

      var token = await BuildToken(user);
      return Ok(token);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthenticationResponse>> Login(
        [FromBody] UserCredentials userCredentials)
    {
      var user = await _userManager.FindByEmailAsync(userCredentials.Email);

      if (user == null) return Unauthorized("Incorrect Login");

      var result = await _signInManager.CheckPasswordSignInAsync(user, userCredentials.Password, false);

      if (!result.Succeeded) return Unauthorized("Incorrect Login");

      var token = await BuildToken(user);
      return Ok(token);

      //var result = await _signInManager.PasswordSignInAsync(userCredentials.Email,
      //    userCredentials.Password, isPersistent: false, lockoutOnFailure: false);

      //if (result.Succeeded)
      //{
      //  return BuildToken(userCredentials);
      //}
      //else
      //{
      //  return BadRequest("Incorrect Login");
      //}
    }

    private async Task<AuthenticationResponse> BuildToken(IdentityUser user)
    {
      //Get Claims of the user (from DB)
      var claimsDB = await _userManager.GetClaimsAsync(user);

      //list of claims
      List<Claim> claims = new()
      {
        //Add claims based on the IdentityUser 
        new Claim("email", user.Email)
      };
      //Add claims from AspNetUserClaims
      claims.AddRange(claimsDB);

      //encryption key
      var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
        _configuration.GetValue<string>("JwtKey")));

      //credentials
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      //expiration time
      var expiration = DateTime.UtcNow.AddDays(1);

      var token = new JwtSecurityToken(claims: claims, expires: expiration, signingCredentials: creds);

      return new AuthenticationResponse()
      {
        Token = new JwtSecurityTokenHandler().WriteToken(token),
        Expiration = expiration
      };
    }
  }
}
