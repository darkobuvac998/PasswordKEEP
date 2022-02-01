import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClassConstructor,
  plainToInstance,
} from 'node_modules/class-transformer';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public loading: boolean = false;

  constructor(private httpClient: HttpClient) {}

  getItem<T>(url: string, cls: ClassConstructor<T>) {
    this.loading = true;
    return this.httpClient.get<T>(url).pipe(
      map((res) => plainToInstance<T, Object>(cls, res)),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  getAllItems<T>(url: string, cls: ClassConstructor<T[]>) {
    this.loading = true;
    return this.httpClient.get<T>(url).pipe(
      map((res) => plainToInstance<T[], Object>(cls, res)),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }

  postItem<T>(url: string, cls: ClassConstructor<T>, data: T) {
    this.loading = true;
    return this.httpClient.post<T>(url, data).pipe(
      map((res) => plainToInstance<T, Object>(cls, res)),
      catchError((err) => {
        console.log(err);
        return throwError(err);
      })
    );
  }
}
