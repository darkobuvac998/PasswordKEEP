import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { AuthService } from '../auth/auth.service';
import { User } from '../models/user.model';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';
import { handleError } from '../shared/global-error-handler.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent extends ApplicationBaseComponent<User> {
  @ViewChildren(AppCardComponent) userCards: QueryList<AppCardComponent>;

  constructor(
    protected override httpService: HttpService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notificationService: NotificationService,
    protected override modalService: NgbModal,
    private authService: AuthService
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
    // let user = new User();
    // user.username = 'buvacd';
    // user.email = 'darko.buvac@gmail.com';
    // user.id = 'aksjdfalksjdflkasfjlaskl024234klj';
    // user.firstName = 'Darko';
    // user.lastName = 'Buvac';
    // user.phoneNumber = '066/062-952';
    // this.items.push(user);
    // this.selectedItem = user;
    // this.buildQueryParams = true;

    this.onReload();
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
          console.log(res);
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
    console.log('OnLoad');
    this.onLoadItems();
  }

  override updateItem(): void {
    console.log('update')
    this.authService.updateUserProfile(this.selectedItem).subscribe({
      next: (res) => {
        if (res) {
          this.selectedItem = res;
          this.authService.user = res;
          this.notificationService.showSuccess('User successfully updated!');
        }
      },
      error: (err) => handleError(err),
      complete: () => {},
    });
  }

  override onSave(): void {
    this.updateItem();
  }
}
