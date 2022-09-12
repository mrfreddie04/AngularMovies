using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Formatters;
using Movies.DTOs;
using Movies.Entities;
using NetTopologySuite.Geometries;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Movies.Helpers
{
  public class AutoMapperProfiles: Profile
  {
    public AutoMapperProfiles(GeometryFactory geometryFactory)
    {
      CreateMap<GenreDTO, Genre>().ReverseMap();
      
      CreateMap<GenreCreateDTO, Genre>();
      
      CreateMap<ActorDTO, Actor>().ReverseMap();

      //we cannot map FormFile to a string
      CreateMap<ActorCreateDTO, Actor>()
        .ForMember(dest => dest.Picture, options => options.Ignore());

      CreateMap<Theater, TheaterDTO>()
        .ForMember(dest => dest.Latitude, options => options.MapFrom(src => src.Location.Y))
        .ForMember(dest => dest.Longitude, options => options.MapFrom(src => src.Location.X));

      CreateMap<TheaterCreateDTO, Theater>()
        .ForMember(dest => dest.Location, options => options.MapFrom(src =>
          geometryFactory.CreatePoint(new Coordinate(src.Longitude, src.Latitude))));

      CreateMap<MovieCreateDTO, Movie>()
        .ForMember(dest => dest.Poster, options => options.Ignore())
        .ForMember(dest => dest.MoviesGenres, options => options.MapFrom(MapMoviesGenres))
        .ForMember(dest => dest.MoviesTheaters, options => options.MapFrom(MapMoviesTheaters))
        .ForMember(dest => dest.MoviesActors, options => options.MapFrom(MapMoviesActors));

      CreateMap<Movie, MovieDTO>()
        .ForMember(dest => dest.Genres, options => options.MapFrom(MapMoviesGenres))
        .ForMember(dest => dest.Theaters, options => options.MapFrom(MapMoviesTheaters))
        .ForMember(dest => dest.Actors, options => options.MapFrom(MapMoviesActors));

      CreateMap<IdentityUser, UserDTO>();
    }

    private List<ActorMovieDTO> MapMoviesActors(Movie movie, MovieDTO movieDTO)
    {
      var result = new List<ActorMovieDTO>();
      if (movie.MoviesActors != null)
      {
        foreach (var movieActor in movie.MoviesActors)
        {
          result.Add(new ActorMovieDTO()
          {
            Id = movieActor.ActorId,
            Picture = movieActor.Actor.Picture,
            Name = movieActor.Actor.Name,
            Character = movieActor.Character,
            Order = movieActor.Order
          });
        }
      }
      return result;
    }

    private List<GenreDTO> MapMoviesGenres(Movie movie, MovieDTO movieDTO)
    {
      if (movie.MoviesGenres == null) return new List<GenreDTO>();
      return movie.MoviesGenres
          .Select(mg => mg.Genre)
          .Select(g => new GenreDTO() { Id = g.Id, Name = g.Name })
          .ToList();
    }

    private List<TheaterDTO> MapMoviesTheaters(Movie movie, MovieDTO movieDTO)
    {
      if (movie.MoviesTheaters == null) return new List<TheaterDTO>();
      return movie.MoviesTheaters
          .Select(mt => mt.Theater)
          .Select(t => new TheaterDTO()
          {
            Id = t.Id, Name = t.Name, Latitude = t.Location.Y, Longitude = t.Location.X 
          })
          .ToList();
    }

    private List<MovieGenre> MapMoviesGenres(MovieCreateDTO movieCreateDTO, Movie movie)
    {
      if (movieCreateDTO.GenreIds == null) return new List<MovieGenre>();
      return movieCreateDTO.GenreIds.Select(id => new MovieGenre() { GenreId = id }).ToList();
    }

    private List<MovieTheater> MapMoviesTheaters(MovieCreateDTO movieCreateDTO, Movie movie)
    {
      if (movieCreateDTO.TheaterIds == null) return new List<MovieTheater>();
      return movieCreateDTO.TheaterIds.Select(id => new MovieTheater() { TheaterId = id }).ToList();
    }

    private List<MovieActor> MapMoviesActors(MovieCreateDTO movieCreateDTO, Movie movie)
    {
      if (movieCreateDTO.Actors == null) return new List<MovieActor>();
      return movieCreateDTO.Actors.Select(actor => 
        new MovieActor() { ActorId = actor.Id, Character = actor.Character }).ToList();
    }
  }
}
