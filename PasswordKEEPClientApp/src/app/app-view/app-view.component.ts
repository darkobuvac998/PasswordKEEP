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
    let userId = 'ace7fb5c-0238-472d-a8e0-98954f864fec'; //TODO
    this.resourceUrl = `api/${userId}/applications`;
    this.classType = Application;
    this.loadItems = true;
  }

  override ngOnInit(): void {
    this.applicationAddModel = new Application();
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
