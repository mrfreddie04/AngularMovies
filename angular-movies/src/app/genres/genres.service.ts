import { GenreCreateDTO } from './../_model/genres.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreDTO } from '../_model/genres.model';
import { environment } from "./../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GenresService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl + "/genres";

  public get(): Observable<GenreDTO[]> {
    return this.http.get<GenreDTO[]>(this.apiUrl);
  }

  public getById(id: number): Observable<GenreDTO> {
    return this.http.get<GenreDTO>(`${this.apiUrl}/${id}`);
  }

  public create(genre: GenreCreateDTO) {
    return this.http.post(this.apiUrl, genre);
  }

  public edit(id: number, genre: GenreCreateDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, genre);
  }

  public delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }  
}
