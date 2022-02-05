import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  set(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
  get(key: string) {
    return window.localStorage.getItem(key);
  }
  remove(key: string) {
    window.localStorage.removeItem(key);
  }
  clearStorage() {
    window.localStorage.clear();
  }
}
