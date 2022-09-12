import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Base64 } from 'js-base64';
import { environment } from './../../environments/environment';
import { AuthenticationResponseDTO, UserDTO, AccountDTO, UserCredentialsDTO } from '../_model/security.models';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly tokenKey: string = "token";
  private readonly tokenExpiration: string = "token-expiration";
  private readonly apiUrl = environment.apiUrl + "/accounts";

  public currentAccountSource$ = new BehaviorSubject<AccountDTO>(null);
  public currentAccount$ = this.currentAccountSource$.asObservable();

  constructor(private http: HttpClient) { }

  public register(credentials: UserCredentialsDTO): Observable<AuthenticationResponseDTO> {
    return this.http.post<AuthenticationResponseDTO>(`${this.apiUrl}/create`,credentials).pipe(
      tap(authenticationDTO => {
        this.saveToken(authenticationDTO);
        this.currentAccountSource$.next(this.getAccountDTO(authenticationDTO.token));
      })
    );
  }

  public login(credentials: UserCredentialsDTO): Observable<AuthenticationResponseDTO> {
    return this.http.post<AuthenticationResponseDTO>(`${this.apiUrl}/login`,credentials).pipe(
      tap(authenticationDTO => {
        console.log("Login",authenticationDTO);
        this.saveToken(authenticationDTO);
        this.currentAccountSource$.next(this.getAccountDTO(authenticationDTO.token));
      })
    );
  }  

  public getUsers(pageNumber: number, pageSize: number): Observable<HttpResponse<UserDTO[]>> {
    const params = new HttpParams()
      .append("pageNumber",pageNumber)
      .append("pageSize", pageSize);

    return this.http.get<UserDTO[]>(`${this.apiUrl}/list-users`, {
      params: params,
      observe: "response"
    });
  }  
  
  public makeAdmin(userId: string) {
    const headers = new HttpHeaders().append("Content-Type", "application/json");
    return this.http.post(`${this.apiUrl}/make-admin`, 
      JSON.stringify(userId), { headers: headers});
  }  
  
  public removeAdmin(userId: string) {
    const headers = new HttpHeaders().append("Content-Type", "application/json");
    return this.http.post(`${this.apiUrl}/remove-admin`, 
      JSON.stringify(userId), { headers: headers});
  }    

  public logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpiration);
    this.currentAccountSource$.next(null);
  }  

  public loadCurrentAccount() {
    //normally make a call to the back end and get the user info based on the token
    const authenticationDTO = this.getAuthenticationDTO()
    if(authenticationDTO) {
      this.currentAccountSource$.next(this.getAccountDTO(authenticationDTO.token));
    }
  }  

  public getRole(): string {
    return this.getFieldFromJwt(this.getToken(), "role");
    //return this.currentAccountSource$?.value.role;
  }

  public isAuthorized(role: string) {
    return this.isAuthenticated() && this.getRole() === role;
  }  

  public isAuthenticated(): boolean {
    return (!!this.currentAccountSource$.value);
  }

  public getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  private saveToken(authenticationDTO: AuthenticationResponseDTO) {
    localStorage.setItem(this.tokenKey, authenticationDTO.token);
    localStorage.setItem(this.tokenExpiration, authenticationDTO.expiration.toString());
  }

  private getFieldFromJwt(token: string,field: string): string {
    console.log("Payload",Base64.atob(token.split(".")[1]));
    const dataToken = JSON.parse(Base64.atob(token.split(".")[1]));
    return dataToken[field];
  }

  private getAuthenticationDTO(): AuthenticationResponseDTO | null {
    const token = localStorage.getItem(this.tokenKey);
    if(!token) return null;
    
    const expiration = localStorage.getItem(this.tokenExpiration);
    const expirationDate = new Date(expiration);

    if(expirationDate < new Date()) {
      this.logout()
      return null;
    }  

    const authenticationDTO: AuthenticationResponseDTO = {
      token: token,
      expiration: expirationDate
    }

    return authenticationDTO;
  }  

  private getAccountDTO(token: string): AccountDTO {
    const accountDTO: AccountDTO = {
      email: this.getFieldFromJwt(token, "email"),
      role: this.getFieldFromJwt(token, "role")
    }

    return accountDTO;
  }

}
