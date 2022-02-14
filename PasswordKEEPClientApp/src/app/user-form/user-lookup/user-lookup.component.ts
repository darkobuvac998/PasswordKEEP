import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/auth.service';
import { Confirmable } from 'src/app/decorators/method.decorator';
import { User } from 'src/app/models/user.model';
import { NotificationService } from 'src/app/services/notification-service.service';
import { handleError } from 'src/app/shared/global-error-handler.service';

@Component({
  selector: 'app-user-lookup',
  templateUrl: './user-lookup.component.html',
  styleUrls: ['./user-lookup.component.css'],
})
export class UserLookupComponent implements OnInit {
  public user: User;
  constructor(
    private authSevice: AuthService,
    private notificationService: NotificationService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  @Confirmable('Question', `Are you sure you want to delete user?`)
  deleteUser() {
    this.authSevice.deleteUser(this.user?.userName).subscribe({
      next: (res) => {
        this.notificationService.showSuccess(
          `User ${this.user?.userName} is removed!`
        );
        this.close(res);
      },
      error: (err) => {
        handleError(err), this.dismiss();
      },
      complete: () => {},
    });
  }

  close(result: any) {
    this.activeModal.close(result);
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
