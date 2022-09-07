import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TheaterCreateDTO, TheaterDTO } from './../_model/theaters.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TheatersService {
  private apiUrl = environment.apiUrl +"/theaters";
  
  constructor(private http: HttpClient) { }

  public getById(id: number): Observable<TheaterDTO> {
    return this.http.get<TheaterDTO>(`${this.apiUrl}/${id}`);
  }  

  public get(): Observable<TheaterDTO[]> {
    return this.http.get<TheaterDTO[]>(this.apiUrl);
  }

  public create(theater: TheaterCreateDTO) {
    return this.http.post(this.apiUrl, theater);
  }  

  public edit(id: number, theater: TheaterCreateDTO) {
    return this.http.put(`${this.apiUrl}/${id}`, theater);
  }    

  public delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }    
}
