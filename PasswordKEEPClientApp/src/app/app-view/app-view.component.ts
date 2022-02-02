import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Application } from '../models/application.model';
import { FormMode } from '../shared/form-mode';
import { HttpService } from '../services/http-service.service';
import { Account } from '../models/account.model';

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.css'],
})
export class AppViewComponent extends ApplicationBaseComponent<Application> {
  @ViewChildren(AppCardComponent) appCards: QueryList<AppCardComponent>;
  public applicationAddModel: Application;

  constructor(
    private changeDetector: ChangeDetectorRef,
    protected override httpService: HttpService
  ) {
    super(httpService);
    this.title = 'Applications';
    this.mode = FormMode.Thumbnail;
    let userId = 'ace7fb5c-0238-472d-a8e0-98954f864fec'; //TODO
    this.resourceUrl = `api/${userId}/applications`;
    this.classType = Application;
    this.loadItems = true;
  }

  override ngOnInit(): void {
    this.applicationAddModel = new Application();
    let app = new Application();
    app.name= 'LinkedIn';
    app.url = 'https://linkedin.com';
    app.accounts = [];
    app.id = '111';
    let acc = new Account();
    acc.id = '1';
    acc.username = 'buvacd';
    acc.password = '123';
    acc.lastModified = new Date();
    app.accounts.push(acc);
    for(let i = 0; i<10; i++){
      app = {...app, id: i.toString()}
      this.items.push(app);
    }
  }

  override ngAfterViewInit(): void {}

  override onSelectedItemChange(application: Application) {
    super.onSelectedItemChange(application);
    this.appCards.forEach((item) => (item.selected = false));
  }

  override onItemDoubleClick(application: Application): void {
    super.onItemDoubleClick(application);
    this.appCards.forEach((item) => (item.selected = false));
  }
}
