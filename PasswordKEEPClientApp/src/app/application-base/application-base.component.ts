import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassConstructor } from 'class-transformer';
import { Subscription, timer } from 'rxjs';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';
import { GlobalErrorHandler } from '../shared/global-error-handler.service';

@Component({
  selector: 'application-base',
  templateUrl: './application-base.component.html',
  styleUrls: ['./application-base.component.css'],
  // providers: [GlobalErrorHandler],
})
export class ApplicationBaseComponent<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() public items: any[] | T[] = [];
  @Input() public selectedItem: T | any;
  private _mode: FormMode;
  private _oldMode: FormMode;
  private _resourceUrl: string;
  private _classType: ClassConstructor<T>;
  private _itemsType: ClassConstructor<T[]>;
  public formMode = FormMode;
  public loadItems: boolean = false;
  public showToolbar: boolean = false;
  private _title: string;
  public itemAdd: T | any;
  public subscription: Subscription;
  private _component: ApplicationBaseComponent<T> = this;
  public showGoToAppButton: boolean = false;
  public showQueryParams: boolean = false;
  get component(): ApplicationBaseComponent<T> {
    return this._component;
  }
  @Input('component')
  set component(value: ApplicationBaseComponent<T>) {
    this._component = value;
  }

  public get oldMode() {
    return this._oldMode;
  }
  public set oldMode(newMode: FormMode) {
    this._oldMode = newMode;
  }
  public get mode() {
    return this._mode;
  }
  public set mode(newMode: FormMode) {
    this._mode = newMode;
  }
  public get title() {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
  }

  public get resourceUrl() {
    return this._resourceUrl;
  }
  public set resourceUrl(value: string) {
    this._resourceUrl = value;
  }
  public get classType() {
    return this._classType;
  }
  public set classType(value: ClassConstructor<T>) {
    this._classType = value;
  }
  public get itemsType() {
    return this._itemsType;
  }
  public set itemsType(value: ClassConstructor<T[]>) {
    this._itemsType = value;
  }

  @ContentChild('listTemplate') listTemplate: TemplateRef<any>;
  @ContentChild('detailTemplate') detailTemplate: TemplateRef<any>;

  constructor(
    protected httpService: HttpService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // const time = timer(1000, 1000);
    // this.mode = this.component.mode;
    // time.subscribe(() => {});
    // this.component.onLoadItems();
    // console.log('Component instantiated');
  }

  ngAfterViewInit(): void {
    this.afterLoadItems();
  }

  ngOnDestroy(): void {
    this.component?.subscription?.unsubscribe();
  }

  onModeChange(newMode: FormMode) {
    let oldMode = this.component.mode;
    if (oldMode == FormMode.Edit || oldMode == FormMode.Add) {
      this.component.mode = this.component.oldMode;
      return;
    }
    this.component.oldMode = oldMode;
    if (newMode != oldMode) {
      this.component.mode = newMode;
    } else {
      return;
    }
    if (this.showQueryParams) {
      if (newMode != this.formMode.Thumbnail && newMode != this.formMode.Add) {
        this.onModeChangeRouteUpdate(true);
      } else {
        this.onModeChangeRouteUpdate(false);
      }
    }
  }

  onSelectedItemChange(item: any) {
    this.component.selectedItem = item;
  }

  onItemDoubleClick(item: any) {
    this.selectedItem = item;
    // this.component.mode = this.formMode.Detail;
    this.onModeChange(this.formMode.Detail);
  }

  onReload() {
    this.onLoadItems();
    this.afterLoadItems();
  }

  onLoadItems() {
    if (this.component.loadItems) {
      this.component.items = [];
      this.subscription = this.httpService
        .getAllItems<T>(this.component.resourceUrl, this.component.itemsType)
        .subscribe({
          next: (res) => {
            this.component.items = res;
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {},
        });
    }
  }

  afterLoadItems() {
    this.subscription = timer(1000).subscribe(() => {
      if (this.component.items?.length > 0) {
        this.component.selectedItem = this.component.items[0];
      }
    });
  }

  private updateItem() {
    // this.notificationService.showInfo('', 'Information');
    let url = `${this.resourceUrl}/${this.selectedItem?.id}`;
    this.subscription = this.httpService
      .updateItem<T>(url, this.classType, this.selectedItem)
      .subscribe({
        next: (res) => {
          this.component.selectedItem = res;
          this.notificationService.showSuccess(`Item ${this.selectedItem.id} updated succesfully!`);
        },
        error: (err: HttpErrorResponse | Error) => {
          // console.log(err);
          this.notificationService.showError(err.message)
        },
        complete: () => {},
      });
  }

  private addItem() {
    let url = `${this.component.resourceUrl}`;
    this.subscription = this.httpService
      .postItem<T>(url, this._classType, this.itemAdd)
      .subscribe({
        next: (res) => {
          this.selectedItem = res;
          this.items.push(res);
        },
        error: (err) => {
          // errorHandler(err,this.notificationService);
          // console.log(err);
        },
        complete: () => {
          this.itemAdd = {};
        },
      });
  }

  onSave() {
    if (this.component.mode == FormMode.Edit) {
      this.updateItem();
    } else if (this.component.mode == FormMode.Add) {
      this.addItem();
    }
  }

  goToApplications() {
    this.router
      .navigateByUrl('/applications')
      .then(() => {
        this.showGoToAppButton = false;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onModeChangeRouteUpdate(showParams: boolean) {
    let url = this.component.title.toLowerCase().replace(' ', '');
    if (showParams) {
      this.router.navigate([`/${url}`], {
        queryParams: { id: this.component.selectedItem?.id },
      });
    } else {
      this.router.navigate([`/${url}`]);
    }
  }
}
