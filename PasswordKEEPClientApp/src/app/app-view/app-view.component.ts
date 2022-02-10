import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Application } from '../models/application.model';
import { FormMode } from '../shared/form-mode';
import { HttpService } from '../services/http-service.service';
import { Account } from '../models/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { AccountViewComponent } from '../account-view/account-view.component';
import { NotificationService } from '../services/notification-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QueryParameters } from '../shared/queryParameters';
import { AuthService } from '../auth/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.css'],
})
export class AppViewComponent extends ApplicationBaseComponent<Application> {
  @ViewChildren(AppCardComponent) appCards: QueryList<AppCardComponent>;
  @ViewChild(AccountViewComponent) accounts: AccountViewComponent;
  public applicationAddModel: Application;
  public formAdd: FormGroup;
  constructor(
    private changeDetector: ChangeDetectorRef,
    protected override httpService: HttpService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notificationService: NotificationService,
    protected override modalService: NgbModal,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    super(httpService, router, route, notificationService, modalService);
    this.title = 'Applications';
    this.mode = FormMode.Thumbnail;
    let userId = 'ace7fb5c-0238-472d-a8e0-98954f864fec';
    this.resourceUrl = `api/${this.authService.user.nameidentifier}/applications`;
    this.classType = Application;
    this.loadItems = true;
    this.buildQueryParams = true;
    this.itemAdd = new Application();
    this.queryParameters = new QueryParameters();
    this.queryParameters.baseUrl = this.resourceUrl;
  }

  override ngOnInit(): void {
    this.onReload();
    this.formAdd = this.fb.group({
      applicationName: ['', [Validators.required]],
      appUrl: ['', [Validators.required]],
    });
  }

  override ngAfterViewInit(): void {
    this.onSelectCard(500);
  }

  override onSelectedItemChange(application: Application) {
    super.onSelectedItemChange(application);
    this.appCards.forEach((item) => (item.selected = false));
  }

  override onItemDoubleClick(application: Application): void {
    super.onItemDoubleClick(application);
    this.appCards.forEach((item) => (item.selected = false));
  }

  override onModeChange(newMode: FormMode): void {
    super.onModeChange(newMode);
    this.onSelectCard(50);
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
    } if(this.mode==FormMode.Edit) {
      return true;
    }
    return false;
  }

  getControls(control: string) {
    return this.formAdd.get(control) as FormControl;
  }
}
