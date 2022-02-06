import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { User } from '../models/user.model';
import { NotificationService } from '../services/notification-service.service';
import { handleError } from '../shared/global-error-handler.service';
import { JWTTokenService, TOKEN_KEY } from './jwttoken.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_API = `/api/authenticate`;
  private _userId: string = null;
  public loggedIn: boolean = false;
  public user: User = null;
  private _roles: any[] = [];
  constructor(
    private storageService: LocalStorageService,
    private httpClient: HttpClient,
    private jwtService: JWTTokenService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  public get roles() {
    return this._roles;
  }
  public set roles(value: any[]) {
    this._roles = value;
  }

  logIn(userLogIn: any) {
    let url = `${this.AUTH_API}/log-in`;
    return this.httpClient
      .post<any>(url, userLogIn)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (res) => {
          this.storageService.set(TOKEN_KEY, res.token);
          console.log(this.jwtService.decodeToken());
          this._userId = res.userId;
          this.loggedIn = true;
          this.roles = this.jwtService.getUserRoles();
          this.notificationService.showInfo('User successfully logged in!');
          this.router.navigate(['/applications']);
        },
        error: (err) => handleError(err),
        complete: () => {},
      });
  }

  signIn(userSignIn: any) {
    let url = `${this.AUTH_API}/register-user`;
    this.httpClient
      .post<any>(url, userSignIn)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (res) => {
          //TODO
        },
        error: (err) => handleError(err),
        complete: () => {},
      });
  }

  getUserProfile() {
    let url = `${this.AUTH_API}/user/${this._userId}`;
    return this.httpClient
      .get<User>(url)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (res) => {
          if (res) {
            console.log(this.user);
            this.user = res;
          }
        },
        error: (err) => {
          handleError(err);
        },
        complete: () => {},
      });
  }

  logOut() {
    this.storageService.remove(TOKEN_KEY);
    this.router.navigate(['log-in']);
  }

  isLoggedIn() {
    let token = this.storageService.get(TOKEN_KEY);
    console.log(token);
    if (token) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    return this.loggedIn;
  }
}
