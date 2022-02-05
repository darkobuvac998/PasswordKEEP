import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { timer } from 'rxjs';
import { ServiceInjector } from '../app.module';
import { NotificationService } from '../services/notification-service.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler extends ErrorHandler {
  private notificationService: NotificationService;
  constructor() {
    super();
  }

  override handleError(error) {
    this.notificationService = ServiceInjector.get(NotificationService);
    console.log('Global error handler handled error!');
    if (error instanceof HttpErrorResponse) {
      return this.notificationService.showError(
        `Code: ${error.status} Status: ${error.statusText}`
      );
    } else if (error instanceof Error) {
      this.notificationService.showError(
        `Name: ${error.name} Message: ${error.message.toString()}`
      );
    } else if (error instanceof ErrorEvent) {
      this.notificationService.showError(`Message: ${error.message}`);
    }
  }
}

export function handleError(err: any) {
  const delay = timer(50);
  let notificationService;
  delay.subscribe(() => {
    notificationService = ServiceInjector.get(NotificationService);
    if (err instanceof HttpErrorResponse) {
      return notificationService.showError(
        `Code: ${err.status} Status: ${err.statusText}`
      );
    } else if (err instanceof Error) {
      notificationService.showError(
        `Name: ${err.name} Message: ${err.message}`
      );
    }
  });
}
