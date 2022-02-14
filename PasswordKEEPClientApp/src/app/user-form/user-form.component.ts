import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { AuthService } from '../auth/auth.service';
import { Confirmable } from '../decorators/method.decorator';
import { User } from '../models/user.model';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';
import { handleError } from '../shared/global-error-handler.service';
import { UserLookupComponent } from './user-lookup/user-lookup.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent extends ApplicationBaseComponent<User> {
  @ViewChildren(AppCardComponent) userCards: QueryList<AppCardComponent>;
  public confirmPassword: string = null;
  public formChangePassword: FormGroup;
  public showUsersManagement: boolean;
  public users: User[];

  constructor(
    protected override httpService: HttpService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notificationService: NotificationService,
    protected override modalService: NgbModal,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    super(httpService, router, route, notificationService, modalService);
    this.title = 'User settings';
    this.resourceUrl = `api/authentication/${this.selectedItem?.id}`;
    this.classType = User;
    this.mode = FormMode.Thumbnail;
    this.showGoToAppButton = true;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.onReload();
    this.formChangePassword = this.fb.group({
      userName: [''],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
    });
  }

  override ngAfterViewInit(): void {}

  override onSelectedItemChange(item: any): void {
    super.onSelectedItemChange(item);
    this.userCards.forEach((item) => (item.selected = false));
  }

  override onItemDoubleClick(item: any): void {
    super.onItemDoubleClick(item);
    this.userCards.forEach((item) => (item.selected = false));
  }

  override onModeChange(newMode: FormMode): void {
    super.onModeChange(newMode);
    this.onSelectCard(500);
  }

  onSelectCard(time: number) {
    let delay = timer(time);
    delay.subscribe(() => {
      this.userCards.forEach((item) => {
        if (item.item.id == this.selectedItem?.id) {
          item.selected = true;
        }
      });
    });
  }

  override onLoadItems(): void {
    this.authService.getUserProfile().subscribe({
      next: (res) => {
        if (res) {
          this.selectedItem = res;
          this.items = [];
          this.items.push(this.selectedItem);
        }
      },
      error: (err) => {
        handleError(err);
      },
      complete: () => {},
    });
  }

  override onReload(): void {
    this.onLoadItems();
  }

  override updateItem(): void {
    console.log('update');
    this.authService.updateUserProfile(this.selectedItem).subscribe({
      next: (res) => {
        if (res) {
          console.log(res);
          this.selectedItem = res;
          this.notificationService.showSuccess('User successfully updated!');
        }
      },
      error: (err) => handleError(err),
      complete: () => {},
    });
  }

  @Confirmable(
    'Question',
    `Do you wan't to delete you profile? All your passwords will be lost!`
  )
  override onDelete(): void {
    this.authService.deleteUser(this.selectedItem?.userName).subscribe({
      next: (res) => {
        if (res) {
          this.notificationService.showSuccess('User successfully deleted|');
          this.authService.logOut();
        }
      },
      error: (err) => handleError(err),
      complete: () => {},
    });
  }

  override onSave(): void {
    this.selectedItem = {
      ...this.selectedItem,
      password: this.confirmPassword,
    };
    this.updateItem();
  }

  override canSave(): boolean {
    let valid = true;
    if (this.selectedItem) {
      Object.keys(this.selectedItem).forEach((prop) => {
        if (!this.selectedItem[prop]) {
          valid = false;
        }
      });
    }

    return valid && !!this.confirmPassword;
  }

  isAdmin() {
    let roles = this.authService.roles.pop();
    return roles.includes('Admin');
  }

  changePassword() {
    let dto = {};
    Object.keys(this.formChangePassword.controls).forEach((prop) => {
      dto = {
        ...dto,
        [prop.toString()]: this.formChangePassword.controls[prop].value,
      };
    });

    dto = { ...dto, userName: this.authService.user.name };
    console.log(dto);

    this.authService.changePassword(dto).subscribe({
      next: (res) => {
        this.notificationService.showSuccess('Password successfully changed!');
      },
      error: (err) => handleError(err),
      complete: () => {
        this.formChangePassword.reset();
      },
    });
  }

  showUsersMangementPanel() {
    this.showUsersManagement = !this.showUsersManagement;
  }

  showUsers() {
    // this.showUsersMangementPanel();
    this.authService.getUsers().subscribe({
      next: (res) => {
        if (res) {
          this.users = res;
        }
      },
      error: (err) => handleError(err),
      complete: () => {},
    });
  }

  override mngUsers(): void {
    this.showUsersMangementPanel();
    this.showUsers();
  }

  userDetalis(user: any) {
    let modalRef = this.modalService.open(UserLookupComponent, {
      animation: true,
      centered: true,
    });
    modalRef.componentInstance.user = user;
    modalRef.result
      .then((result) => {
        console.log(result);
        if (result) {
          this.users = this.users.filter((item) => {
            return item.id != user.id;
          });
        }
      })
      .catch((err) => {
        handleError(err);
      });
  }
}
