import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notification-service.service';
import { AuthService } from './auth.service';
import { JWTTokenService } from './jwttoken.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JWTTokenService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let expired = this.jwtService.isTokenExpired();
    let loggedIn = this.authService.isLoggedIn();

    if (!loggedIn) {
      this.notificationService.showWarning('User is not logged in!');
      this.router.navigate(['/log-in']);
    }
    if (expired) {
      this.notificationService.showWarning(
        'Token expired. Please log in again!'
      );
      this.router.navigate(['/log-in']);
    }
    return true;
  }
}
