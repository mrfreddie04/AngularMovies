﻿using System.Collections.Generic;

namespace Movies.DTOs
{
  public class HomeDTO
  {
    public List<MovieDTO> InTheaters { get; set; }
    public List<MovieDTO> UpcomingReleases { get; set; }
  }
}
