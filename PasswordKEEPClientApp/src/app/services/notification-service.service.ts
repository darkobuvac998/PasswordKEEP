import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title?: string | null) {
    this.toastr.success(message, title ? title : 'Success');
  }
  showInfo(message: string, title?: string | null) {
    this.toastr.info(message, title ? title : 'Information');
  }
  showError(message: string, title?: string | null) {
    this.toastr.error(message, title ? title : 'Error');
  }
  showWarning(message: string, title?: string | null){
    this.toastr.warning(message, title ? title : 'Warning');
  }
}
