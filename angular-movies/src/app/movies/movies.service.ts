import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { formatDateFormData } from '../utilities/utils';
import { HomeDTO, MovieCreateDTO, MovieDTO, MoviePostGetDTO, MoviePutGetDTO } from '../_model/movies.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private apiUrl = environment.apiUrl + "/movies";
  
  constructor(private http: HttpClient) { }

  public getHomePageMovies(): Observable<HomeDTO> {
    return this.http.get<HomeDTO>(this.apiUrl);
  }  

  public getById(id: number): Observable<MovieDTO> {
    return this.http.get<MovieDTO>(`${this.apiUrl}/${id}`);
  }  

  public getFiltered(terms: any): Observable<HttpResponse<MovieDTO[]>> {
    const params = new HttpParams({fromObject: terms});
    return this.http.get<MovieDTO[]>(`${this.apiUrl}/filter`, { 
      params: params,
      observe: "response" 
    });
  }

  public getPostGet(): Observable<MoviePostGetDTO> {
    return this.http.get<MoviePostGetDTO>(`${this.apiUrl}/postget`);
  }

  public getPutGet(id: number): Observable<MoviePutGetDTO> {
    return this.http.get<MoviePutGetDTO>(`${this.apiUrl}/putget/${id}`);
  }

  public create(movie: MovieCreateDTO): Observable<number> {
    const formData = this.buildFormData(movie);
    return this.http.post<number>(this.apiUrl, formData);
  }  

  public edit(id: number, movie: MovieCreateDTO) {
    const formData = this.buildFormData(movie);
    //console.log("Movie Edit",id,movie);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }    

  public delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }     

  private buildFormData(movie: MovieCreateDTO): FormData {
    const formData = new FormData();
    formData.append("title",movie.title);
    formData.append("inTheaters",String(movie.inTheaters));
    if(movie.summary) formData.append("summary",movie.summary);
    if(movie.trailer) formData.append("trailer",movie.trailer);
    if(movie.releaseDate) formData.append("releaseDate",formatDateFormData(movie.releaseDate));
    if(movie.genreIds) formData.append("genreIds",JSON.stringify(movie.genreIds));
    if(movie.theaterIds) formData.append("theaterIds",JSON.stringify(movie.theaterIds));
    if(movie.actors) formData.append("actors",JSON.stringify(movie.actors));
    if(movie.poster) formData.append("poster",movie.poster);        
    return formData;
  }  
}

