import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClassConstructor } from 'class-transformer';
import {
  debounceTime,
  Observable,
  Subject,
  Subscription,
  throwError,
  timer,
} from 'rxjs';
import { Confirmable } from '../decorators/method.decorator';
import { HttpService } from '../services/http-service.service';
import { NotificationService } from '../services/notification-service.service';
import { FormMode } from '../shared/form-mode';
import { handleError } from '../shared/global-error-handler.service';
import { QueryParameters } from '../shared/queryParameters';

@Component({
  selector: 'application-base',
  templateUrl: './application-base.component.html',
  styleUrls: ['./application-base.component.css'],
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
  public buildQueryParams: boolean = false;
  public queryParameters: QueryParameters = new QueryParameters();
  public selecteItemChange: Subject<T> = new Subject<T>();
  public selecteItemChange$: Observable<T>;
  public search: Subject<string> = new Subject<string>();
  public search$: Observable<string>;
  private _searchTerm: string = null;
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
    protected notificationService: NotificationService,
    protected modalService: NgbModal
  ) {
    this.selecteItemChange$ = this.selecteItemChange.asObservable();
    this.selecteItemChange$.subscribe((item) => {
      this.component.queryParameters.currentItem = item;
    });
    this.search$ = this.search.asObservable();
    this.search$.pipe(debounceTime(1000)).subscribe(() => {
      this.component.queryParameters.search = this._searchTerm;
      this.updateRouterUrl();
    });
  }

  ngOnInit(): void {
    this.queryParameters.mode = this.component.mode;
    if (this.component.buildQueryParams) {
      this.updateRouterUrl();
    }
  }

  ngAfterViewInit(): void {
    const delay = timer(1000);
    delay.subscribe(() => this.afterLoadItems());
  }

  ngOnDestroy(): void {
    this.component?.subscription?.unsubscribe();
  }

  onModeChange(newMode: FormMode) {
    let oldMode = this.component.mode;
    if (oldMode == FormMode.Edit || oldMode == FormMode.Add) {
      this.component.mode = this.component.oldMode;
      this.component.queryParameters.mode = newMode;
      return;
    }
    this.component.oldMode = oldMode;
    if (newMode != oldMode) {
      this.component.mode = newMode;
      this.component.queryParameters.mode = newMode;
    } else {
      return;
    }
    if (this.component.buildQueryParams) {
      this.updateRouterUrl();
    }
  }

  onSelectedItemChange(item: any) {
    this.component.selectedItem = item;
    this.selecteItemChange.next(item);
  }

  onItemDoubleClick(item: any) {
    this.selectedItem = item;
    this.selecteItemChange.next(item);
    this.onModeChange(this.formMode.Detail);
  }
  /**
   * @param {string} path
   * {@Link onLoadItems}
   */
  onReload() {
    if (this.component.mode == FormMode.Detail) {
      this.onCurrentItemLoad();
    } else {
      this.onLoadItems();
      this.afterLoadItems();
    }
  }
  afterLoadItems() {
    this.subscription = timer(10).subscribe(() => {
      if (this.component.items?.length > 0) {
        this.component.selectedItem = this.component.items[0];

        this.buildQueryParams ? this.updateRouterUrl() : null;
        this.component.queryParameters.mode = this.component.mode;
      }
    });
  }
  onLoadItems() {
    this.component.items = [];
    this.subscription = this.httpService
      .getAllItems<T>(this.component.resourceUrl, this.component.itemsType)
      .subscribe({
        next: (res) => {
          this.component.items = res;
        },
        error: (err) => {
          handleError(err);
        },
        complete: () => {},
      });
  }

  onCurrentItemLoad() {
    let url = `${this.component.resourceUrl}/${this.component.selectedItem.id}`;
    this.subscription = this.httpService
      .getItem<T>(url, this.component.classType)
      .subscribe({
        next: (res) => {
          if (res) {
            this.selectedItem = res;
            this.updateItems(res);
          }
        },
        error: (err) => handleError(err),
        complete: () => {},
      });
  }

  updateItem() {
    let url = `${this.component.resourceUrl}/${this.component.selectedItem?.id}`;
    this.subscription = this.httpService
      .updateItem<T>(url, this.classType, this.component.selectedItem)
      .subscribe({
        next: (res) => {
          this.component.selectedItem = res;
          this.notificationService.showSuccess(
            `Item ${this.component.selectedItem?.id} updated succesfully!`
          );
          this.onModeChange(FormMode.Thumbnail);
        },
        error: (err: HttpErrorResponse | Error) => {
          handleError(err);
        },
        complete: () => {},
      });
  }

  addItem() {
    let url = `${this.component.resourceUrl}`;
    console.log(this.component.itemAdd);
    this.subscription = this.httpService
      .postItem<T>(url, this._classType, this.component.itemAdd)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.component.selectedItem = res;
          this.component.items.push(res);
          this.clearAddItem();
          this.notificationService.showSuccess('Successfully saved!');
          this.onModeChange(FormMode.Thumbnail);
        },
        error: (err) => {
          handleError(err);
        },
        complete: () => {
          this.itemAdd = {};
        },
      });
  }

  @Confirmable('Question', 'Are you sure?')
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

  @Confirmable('Question', 'Are you sure you want to delete this item?')
  onDelete() {
    let url = `${this.component.resourceUrl}/${this.component.selectedItem.id}`;
    this.subscription = this.httpService.deleteItem<T>(url).subscribe({
      next: (result) => {
        this.notificationService.showSuccess(
          `Item with id: ${this.selectedItem.id} removed!`
        );
        if (this.component.items.length > 0) {
          console.log(this.component.items);
          this.component.items = this.component.items.filter(
            (item) => item.id != this.component.selectedItem.id
          );
          this.selectedItem = this.items[0];
          console.log(this.component.items);
          this.onModeChange(FormMode.Thumbnail);
        }
      },
      error: (err: HttpErrorResponse | Error) => {
        handleError(err);
      },
      complete: () => {},
    });
  }

  onSearch(searchTerm: string) {
    this._searchTerm = searchTerm;
    this.search.next(this._searchTerm);
  }

  canSave() {
    return true;
  }
  canEdit() {
    return true;
  }
  canDetail() {
    return true;
  }

  canAdd() {
    return true;
  }

  canDelete(){
    return true;
  }

  private updateRouterUrl() {
    var questionMark = this.router.url.indexOf('?');
    var url =
      questionMark > -1
        ? this.router.url.substring(0, questionMark)
        : this.router.url;
    url = `${url}${this.component.queryParameters.buildQueryParameters()}`;

    this.router.navigateByUrl(url, { replaceUrl: true });
  }

  private updateItems(value: any) {
    this.items = this.items.map((item) => {
      console.log(item);
      item.id != value.id ? item : value;
    });
  }

  private clearAddItem() {
    for (const prop of Object.getOwnPropertyNames(this.component.itemAdd)) {
      delete this.component.itemAdd[prop];
    }
  }
}
