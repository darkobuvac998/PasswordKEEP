import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Account } from '../models/account.model';
import { Application } from '../models/application.model';
import { FormMode } from '../shared/form-mode';
import { ClassConstructor, ClassTransformer } from 'class-transformer';
import { HttpService } from '../services/http-service.service';

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
    let userId = 'kdfj;aksdjf;'; //TODO
    this.resourceUrl = `api/${userId}/appplications`;
    this.classType = Application;
  }

  override ngOnInit(): void {
    let app = new Application();
    app.name = 'LinkedIn';
    app.url = 'https://linkedin.com';
    app.accounts = [];
    app.id = '1';
    let acc = new Account();
    acc.id = '1';
    acc.username = 'buvacd';
    acc.password = '12345';
    acc.lastModified = new Date();
    app.accounts.push(acc);
    app.accounts.push(acc);
    for (let i = 0; i < 10; i++) {
      app = { ...app, id: i.toString() };
      this.items.push(app);
    }
    const time = timer(2000, 1000);
    time.subscribe(() => {
      // console.log(this.title);
      // console.log(this.mode);
    });
    this.applicationAddModel = new Application();

    this.httpService
      .getAllItems<Application>(this.resourceUrl, this.itemsType)
      .subscribe(
        (res) => {
          this.items = res;
        },
        (err) => {
          console.log(err);
        },
        () => {}
      );
  }

  override ngAfterViewInit(): void {
    if (this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
    this.appCards.first.selected = true;
    this.changeDetector.detectChanges();
  }

  override onSelectedItemChange(application: Application) {
    super.onSelectedItemChange(application);
    this.appCards.forEach((item) => (item.selected = false));
  }

  override onItemDoubleClick(application: Application): void {
    super.onItemDoubleClick(application);
    this.appCards.forEach((item) => (item.selected = false));
  }
}
