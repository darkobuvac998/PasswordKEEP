import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Account } from '../models/account.model';
import { Application } from '../models/application.model';
import { HttpService } from '../services/http-service.service';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'account-view',
  templateUrl: './account-view.component.html',
  styleUrls: ['./account-view.component.css'],
})
export class AccountViewComponent extends ApplicationBaseComponent<Account> {
  @ViewChildren(AppCardComponent) appCards: QueryList<AppCardComponent>;
  public accountAdd: Account;
  public showPassword: boolean = false;
  public confirmPassword: string = null;
  constructor(protected override httpService: HttpService) {
    super(httpService);
    this.title = 'Accounts';
    this.mode = FormMode.Thumbnail;
  }

  override ngOnInit(): void {
    if (this.items?.length > 0) {
      this.selectedItem = this.items[0];
    }
    this.accountAdd = new Account();
  }

  override onSelectedItemChange(item: any): void {
    super.onSelectedItemChange(item);
    this.appCards.forEach((item) => (item.selected = false));
  }
  override onItemDoubleClick(item: any): void {
    super.onItemDoubleClick(item);
    this.appCards.forEach((item) => (item.selected = false));
  }

  onShowPassword(){
    this.showPassword = !this.showPassword;
  }
}
