export interface ActorCreateDTO {
  name: string;
  dateOfBirth: Date;
  picture: File;
  biography: string;
}

export interface ActorDTO {
  id: number;
  name: string;
  dateOfBirth: Date;
  picture: string; //URL of the string stored on the server
  biography: string;
}

export interface ActorMovieDTO {
  id: number;
  name: string;
  character: string;
  picture: string; 
  order: number;
}