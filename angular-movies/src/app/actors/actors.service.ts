import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "./../../environments/environment";
import { ActorDTO, ActorMovieDTO } from './../_model/actors.model';
import { formatDateFormData } from '../utilities/utils';
import { ActorCreateDTO } from '../_model/actors.model';

@Injectable({
  providedIn: 'root'
})
export class ActorsService {
  private apiUrl = environment.apiUrl + "/actors";

  constructor(private http: HttpClient) {}

  public getById(id: number): Observable<ActorDTO> {
    return this.http.get<ActorDTO>(`${this.apiUrl}/${id}`)
  }  

  public get(pageNumber: number, pageSize: number): Observable<HttpResponse<ActorDTO[]>> {
    const params = new HttpParams()
      .append("pageNumber",pageNumber)
      .append("pageSize", pageSize);

    return this.http.get<ActorDTO[]>(this.apiUrl, {
      params: params,
      observe: "response"
    });
  }    

  public create(actor: ActorCreateDTO) {
    const formData = this.buildFormData(actor);
    return this.http.post(this.apiUrl, formData);
  }

  public edit(id: number, actor: ActorCreateDTO) {
    const formData = this.buildFormData(actor);
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }  

  public delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }    

  public search(term: string): Observable<ActorMovieDTO[]> {
    const headers = new HttpHeaders().append("Content-Type", "application/json");
    console.log("Term",term);
    return this.http.post<ActorMovieDTO[]>(`${this.apiUrl}/search-by-name`, 
      JSON.stringify(term), { headers: headers});    
  }


  private buildFormData(actor: ActorCreateDTO): FormData {
    const formData = new FormData();
    formData.append("name",actor.name);
    if(actor.biography) formData.append("biography",actor.biography);
    if(actor.dateOfBirth) formData.append("dateOfBirth",formatDateFormData(actor.dateOfBirth));
    if(actor.picture) formData.append("picture",actor.picture);    
    console.log("Picture",formData.get("picture"));    
    return formData;
  }
}
