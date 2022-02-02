import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { User } from '../models/user.model';
import { HttpService } from '../services/http-service.service';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent extends ApplicationBaseComponent<User> {

  @ViewChildren(AppCardComponent) userCards: QueryList<AppCardComponent>;

  constructor(protected override httpService: HttpService) {
    super(httpService);
    this.title = 'User settings';
    this.resourceUrl = `api/authentication/${this.selectedItem?.id}`;
    this.classType = User;
    this.mode = FormMode.Thumbnail;
  }

  override ngOnInit(): void {
    super.ngOnInit();
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
}
