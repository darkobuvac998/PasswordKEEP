import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { TOKEN_KEY } from './jwttoken.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken = this.localStorageService.get(TOKEN_KEY);
    console.log(authToken);
    request = request.clone({
      url: request.url,
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next.handle(request);
  }
}
