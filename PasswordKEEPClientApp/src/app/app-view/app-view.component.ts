import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AppCardComponent } from '../app-card/app-card.component';
import { ApplicationBaseComponent } from '../application-base/application-base.component';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-view',
  templateUrl: './app-view.component.html',
  styleUrls: ['./app-view.component.css'],
})
export class AppViewComponent extends ApplicationBaseComponent {
  @ViewChildren(AppCardComponent) appCards: QueryList<AppCardComponent>;

  constructor(private changeDetector: ChangeDetectorRef) {
    super();
    super.title = 'Applications';
  }

  override ngOnInit(): void {
    let app = new Application();
    app.name = 'LinkedIn';
    app.url = 'https://linkedin.com';
    app.accounts = [];
    app.id = '1';
    for (let i = 0; i < 10; i++) {
      app = { ...app, id: i.toString() };
      this.items.push(app);
    }
    if (this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
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
}
