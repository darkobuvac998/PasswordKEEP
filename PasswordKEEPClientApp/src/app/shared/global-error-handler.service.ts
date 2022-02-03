import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { timer } from 'rxjs';
import { ServiceInjector } from '../app.module';
import { NotificationService } from '../services/notification-service.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService: NotificationService;
  constructor() {}

  handleError(error) {
    console.log(error);
    this.notificationService = ServiceInjector.get(NotificationService);
    if (error instanceof HttpErrorResponse) {
      this.notificationService.showError(
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
