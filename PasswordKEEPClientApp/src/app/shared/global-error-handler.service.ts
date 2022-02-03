import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { NotificationService } from '../services/notification-service.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  private notificationService: any;
  constructor(private readonly injector: Injector) {
    console.log('Global error handler');
  }

  handleError(error) {
    this.notificationService = this.injector.get(NotificationService);
    console.log(error);
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
