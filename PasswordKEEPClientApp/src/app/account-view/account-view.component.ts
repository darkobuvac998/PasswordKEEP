import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Account } from '../models/account.model';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';
import { Clipboard } from '@angular/cdk/clipboard';
import { QueryParameters } from '../shared/queryParameters';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  public copiedToClipboard: boolean = false;
  public formAdd: FormGroup;
  @Input('app') appId: string = null;
  constructor(
    protected override httpService: HttpService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notificationService: NotificationService,
    protected override modalService: NgbModal,
    private clipboard: Clipboard,
    private fb: FormBuilder
  ) {
    super(httpService, router, route, notificationService, modalService);
    this.title = 'Accounts';
    this.mode = FormMode.Thumbnail;

    this.queryParameters = new QueryParameters();
    this.queryParameters.baseUrl = this.resourceUrl;
  }

  override ngOnInit(): void {
    if (this.items?.length > 0) {
      this.selectedItem = this.items[0];
    }
    this.itemAdd = new Account();
    this.resourceUrl = `/api/${this.appId}/accounts`;
    this.onReload();

    this.formAdd = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  override onSelectedItemChange(item: any): void {
    super.onSelectedItemChange(item);
    this.appCards.forEach((item) => (item.selected = false));
  }
  override onItemDoubleClick(item: any): void {
    super.onItemDoubleClick(item);
    this.appCards.forEach((item) => (item.selected = false));
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
    setTimeout(() => {
      this.showPassword = false;
    }, 1500);
  }

  override onModeChange(newMode: FormMode): void {
    super.onModeChange(newMode);
    this.onSelectCard(500);
  }

  onSelectCard(time: number) {
    let delay = timer(time);
    delay.subscribe(() => {
      this.appCards.forEach((item) => {
        if (item.item.id == this.selectedItem?.id) {
          item.selected = true;
        }
      });
    });
  }

  copyToClipboard(password: string) {
    this.copiedToClipboard = true;
    this.clipboard.copy(password);
    let delay = timer(3000);
    delay.subscribe(() => {
      this.copiedToClipboard = false;
    });
  }

  getControls(control: string) {
    return this.formAdd.get(control) as FormControl;
  }

  override canDetail(): boolean {
    return this.selectedItem != null ? true : false;
  }
  override canEdit(): boolean {
    return this.selectedItem != null ? true : false;
  }
  override canDelete(): boolean {
    return this.selectedItem != null ? true : false;
  }

  override canSave(): boolean {
    if (this.mode == FormMode.Add && this.formAdd.valid) {
      return true;
    } else {
      return false;
    }
  }
}
