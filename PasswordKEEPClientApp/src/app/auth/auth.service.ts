import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, of } from 'rxjs';
import { User } from '../models/user.model';
import { NotificationService } from '../services/notification-service.service';
import { handleError } from '../shared/global-error-handler.service';
import { JWTTokenService, TOKEN_KEY, USER_KEY } from './jwttoken.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private AUTH_API = `/api/authentication`;
  private _userId: string = null;
  public loggedIn: boolean = false;
  public user: any = null;
  private _roles: any[] = [];
  constructor(
    private storageService: LocalStorageService,
    private httpClient: HttpClient,
    private jwtService: JWTTokenService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.user = jwtService.getUserObject();
  }

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
          this.jwtService.setToken(res.token);
          this.jwtService.setUserObject();
          this.user = this.jwtService.getUserObject();
          this.loggedIn = true;
          this.roles = this.jwtService.getUserRoles();
          this.notificationService.showInfo(
            `${this.user.name} successfully logged in!`
          );
          this.router.navigate(['/applications']);
        },
        error: (err) => handleError(err),
        complete: () => {
        },
      });
  }

  signIn(userSignIn: any) {
    let url = `${this.AUTH_API}/register-user`;
    this.httpClient
      .post<any>(url, userSignIn)
      .pipe(debounceTime(1000))
      .subscribe({
        next: (res) => {
          console.log(res);
          if(res && res.created){
            let userLogIn = { userName: res.userName, password: res.password };
            this.logIn(userLogIn);
          }
        },
        error: (err) => handleError(err),
        complete: () => {},
      });
  }

  getUserProfile() {
    let url = `${this.AUTH_API}/user/${this.user.name}`;
    return this.httpClient.get<User>(url).pipe(debounceTime(1000));
  }

  updateUserProfile(user: any) {
    let url = `${this.AUTH_API}/user/${this.user.name}`;
    console.log(user);
    return this.httpClient.put<User>(url, user).pipe(debounceTime(1000));
  }

  logOut() {
    of(1)
      .pipe(debounceTime(1500))
      .subscribe(() => {
        this.storageService.remove(TOKEN_KEY);
        this.storageService.remove(USER_KEY);
        this.roles = [];
        this.user = null;
        this.router.navigate(['log-in']);
      });
  }

  isLoggedIn() {
    let token = this.storageService.get(TOKEN_KEY);
    // console.log(token);
    if (token) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    return this.loggedIn;
  }
}
