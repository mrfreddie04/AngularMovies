import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { RatingDTO } from '../_model/ratings.model';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = environment.apiUrl + "/ratings";
  
  constructor(private http: HttpClient) { }

  public rate(ratingDTO: RatingDTO) {
    return this.http.post(this.apiUrl, ratingDTO);
  }

}
