import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../services/userService';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.userService.currentUserValue;
    if (currentUser && currentUser.access_token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.access_token}`
        }
      });
    }

    return next.handle(req);
  }
}
