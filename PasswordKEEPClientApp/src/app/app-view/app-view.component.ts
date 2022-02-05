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

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.css'],
})
export class AppViewComponent extends ApplicationBaseComponent<Application> {
  @ViewChildren(AppCardComponent) appCards: QueryList<AppCardComponent>;
  @ViewChild(AccountViewComponent) accounts: AccountViewComponent;
  public applicationAddModel: Application;

  constructor(
    private changeDetector: ChangeDetectorRef,
    protected override httpService: HttpService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notificationService: NotificationService,
    protected override modalService: NgbModal
  ) {
    super(httpService, router, route, notificationService, modalService);
    this.title = 'Applications';
    this.mode = FormMode.Thumbnail;
    let userId = 'ace7fb5c-0238-472d-a8e0-98954f864fec'; //TODO
    this.resourceUrl = `api/${userId}/applications`;
    this.classType = Application;
    this.loadItems = true;
    this.buildQueryParams = true;
    this.itemAdd = new Application();
    this.queryParameters = new QueryParameters();
    this.queryParameters.baseUrl = this.resourceUrl;
  }

  override ngOnInit(): void {
    // this.applicationAddModel = new Application();
    let app = new Application();
    app.name = 'LinkedIn';
    app.url = 'https://linkedin.com';
    app.accounts = [];
    app.id = '111';
    let acc = new Account();
    acc.id = '12312132';
    acc.username = 'buvacd';
    acc.password = '123';
    acc.lastModified = new Date();
    app.accounts.push(acc);
    for (let i = 0; i < 10; i++) {
      app = {
        ...app,
        id: i.toString(),
        accounts: app.accounts.map((item) => {
          return { ...item, id: i.toString() } as Account;
        }),
      };
      this.items.push(app);
    }
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
}
