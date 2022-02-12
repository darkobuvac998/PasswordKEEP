import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ClassConstructor,
  plainToInstance,
} from 'node_modules/class-transformer';
import {
  catchError,
  map,
  Observable,
  of,
  Subject,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public loading: boolean = false;
  public loadingStart: boolean = false;
  private onLoading: Subject<boolean> = new Subject<boolean>();
  public onLoading$: Observable<boolean> = new Observable<boolean>();
  private subscription: Subscription;
  constructor(private httpClient: HttpClient) {
    this.onLoading$ = this.onLoading.asObservable();
  }
  getItem<T>(url: string, cls: ClassConstructor<T>) {
    this.loadingStart = true;
    this.onLoading.next(this.loading);
    this.subscription = timer(500).subscribe(() => (this.loading = true));
    return this.httpClient.get<T>(url).pipe(
      map((res) => {
        this.resetLoading(this.subscription);
        return res;
      }),
      map((res) => plainToInstance<T, Object>(cls, res)),
      catchError((err) => {
        return throwError(() => new Error(err));
      })
    );
  }
  getAllItems<T>(url: string, cls: ClassConstructor<T[]>) {
    this.loading = true;
    this.onLoading.next(this.loading);
    this.subscription = timer(500).subscribe(() => (this.loading = true));
    return this.httpClient.get<T>(url).pipe(
      map((res) => {
        this.resetLoading(this.subscription);
        return res;
      }),
      map((res) => plainToInstance<T[], Object>(cls, res)),
      catchError((err) => {
        return throwError(() => new Error(err));
      })
    );
  }
  postItem<T>(url: string, cls: ClassConstructor<T>, data: T) {
    this.loading = true;
    this.onLoading.next(this.loading);
    this.subscription = timer(500).subscribe(() => (this.loading = true));
    return this.httpClient.post<T>(url, data).pipe(
      map((res) => {
        this.resetLoading(this.subscription);
        return res;
      }),
      map((res) => plainToInstance<T, Object>(cls, res)),
      catchError((err) => {
        throw new Error(err);
      })
    );
  }
  updateItem<T>(url: string, cls: ClassConstructor<T>, data: T) {
    this.loading = true;
    this.onLoading.next(this.loading);
    this.subscription = timer(500).subscribe(() => (this.loading = true));
    return this.httpClient.put<T>(url, data).pipe(
      map((res) => {
        this.resetLoading(this.subscription);
        return res;
      }),
      map((res) => plainToInstance<T, Object>(cls, res)),
      catchError((err) => {
        return throwError(() => new Error(err));
      })
    );
  }
  deleteItem<T>(url: string, obj?: T) {
    this.loading = true;
    this.onLoading.next(this.loading);
    this.subscription = timer(500).subscribe(() => (this.loading = true));
    return this.httpClient.request<T>('delete', url, { body: obj }).pipe(
      map((res) => {
        this.resetLoading(this.subscription);
        return res;
      })
    );
  }
  private resetLoading(subscription: Subscription) {
    this.loading = false;
    subscription.unsubscribe();
    this.loadingStart = false;
    this.onLoading.next(this.loading);
    return of(null);
  }
  isLoading() {
    return this.loading;
  }
}
