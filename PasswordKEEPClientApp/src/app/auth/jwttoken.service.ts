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
      this.decodedToken = jwt_decode(token, { header: true });
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
    return this.decodedToken ? this.decodedToken['exp'] : null;
  }

  getUserRoles() {
    let token = jwt_decode(this.localStorage.get(TOKEN_KEY));
    let roles = [];
    Object.keys(token).forEach((prop) => {
      if (prop.toString().endsWith('role')) {
        roles.push(token[prop]);
      }
    });
    return roles;
  }

  isTokenExpired(): boolean {
    const expiryTime: string = this.getExpiaryTime();
    if (expiryTime) {
      return 1000 * parseInt(expiryTime) - new Date().getTime() < 5000;
    } else {
      return false;
    }
  }

  getUserObject() {
    let user = {};
    let props = ['name', 'nameidentifier', 'emailaddress', 'role'];

    let token = jwt_decode(this.localStorage.get(TOKEN_KEY));
    let res = Object.keys(token).forEach((prop) => {
      props.forEach((item) => {
        if (prop.toString().endsWith(item)) {
          user = { ...user, [item.toString()]: token[prop] };
        }
      });
    });

    // console.log(user);
    return user;
  }
}
