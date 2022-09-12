import { SecurityService } from './security.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private securityService: SecurityService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.securityService.getToken();
    if(token) {
      // const headers = request.headers.append('Authorization', `Bearer ${token}`);
      // request = request.clone({headers: headers});
      request = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    }

    return next.handle(request);
  }
}
