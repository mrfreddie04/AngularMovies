using System;

namespace Movies.DTOs
{
  public class AuthenticationResponse
  {
    public string Token { get; set; }
    public DateTime Expiration { get; set; }
    public string Email { get; set; }
  }
}
