export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CoordinatesWithMessage extends Coordinates {
  message: string; //to stor the name of the movie theater and display it on the marker
}