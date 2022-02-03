import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { User } from '../models/user.model';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';

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
    protected override modalService: NgbModal
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
    let user = new User();
    user.username = 'buvacd';
    user.email = 'darko.buvac@gmail.com';
    user.id = 'aksjdfalksjdflkasfjlaskl024234klj';
    user.firstName = 'Darko';
    user.lastName = 'Buvac';
    user.phoneNumber = '066/062-952';
    this.items.push(user);
    this.selectedItem = user;
    this.showQueryParams = true;
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
}
