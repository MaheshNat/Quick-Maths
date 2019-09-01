import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    console.log('user token: ' + this.authService.user.token);
    if(!this.authService.user)
      return next.handle(req);
    const modifiedReq = req.clone({
      params: new HttpParams().set('auth', this.authService.user.token)
    });
    return next.handle(modifiedReq);
  }
}
