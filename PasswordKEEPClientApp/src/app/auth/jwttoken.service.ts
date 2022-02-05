import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { LocalStorageService } from './local-storage.service';

export const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class JWTTokenService {
  jwtToken: string = null;
  decodedToken: { [key: string]: string };
  constructor(private localStorage: LocalStorageService) {}

  setToken() {}

  decodeToken() {
    let token = this.localStorage.get(TOKEN_KEY);
    if (token) {
      this.decodeToken = jwt_decode(token, { header: true });
    }
  }

  getDecodeToken() {
    return jwt_decode(this.localStorage.get(TOKEN_KEY));
  }

  getUser() {
    this.decodeToken();
    return this.decodeToken ? this.decodedToken['displayName'] : null;
  }

  getExpiaryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken['expiration'] : null;
  }

  getUserRoles() {
    this.decodeToken();
    return this.decodeToken ? this.decodeToken['roles'] : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: string = this.getExpiaryTime();
    if (expiryTime) {
      return 1000 * parseInt(expiryTime) - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }
}
