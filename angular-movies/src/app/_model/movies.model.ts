import { ActorMovieDTO } from './actors.model';
import { GenreDTO } from "./genres.model";
import { TheaterDTO } from "./theaters.model";

export interface MoviePostGetDTO {
  genres: GenreDTO[];
  theaters: TheaterDTO[];
}

export interface MoviePutGetDTO
{
  movie: MovieDTO;
  selectedGenres: GenreDTO[];
  nonSelectedGenres: GenreDTO[];
  selectedTheaters: TheaterDTO[];
  nonSelectedTheaters: TheaterDTO[];
  actors: ActorMovieDTO[];
}


export interface MovieCreateDTO {
  title: string;
  poster: File;
  releaseDate: Date;
  summary: string;
  inTheaters: boolean;
  trailer: string;
  genreIds: number[];
  theaterIds: number[];  
  actors: ActorMovieDTO[];
}

export interface MovieDTO {
  id: number;
  title: string;
  poster: string;
  releaseDate: Date;
  summary: string;
  inTheaters: boolean;
  trailer: string;
  genres: GenreDTO[];
  theaters: TheaterDTO[];
  actors: ActorMovieDTO[];
}

export interface HomeDTO {
  inTheaters: MovieDTO[];
  upcomingReleases: MovieDTO[];
}