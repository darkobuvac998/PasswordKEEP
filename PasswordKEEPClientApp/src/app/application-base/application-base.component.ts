import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ClassConstructor } from 'class-transformer';
import { Subscription, timer } from 'rxjs';
import { HttpService } from '../services/http-service.service';
import { FormMode } from '../shared/form-mode';

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

  constructor(protected httpService: HttpService) {}

  ngOnInit(): void {
    // const time = timer(1000, 1000);
    // this.mode = this.component.mode;
    // time.subscribe(() => {});
    this.component.onLoadItems();
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
  }

  onSelectedItemChange(item: any) {
    this.component.selectedItem = item;
  }

  onItemDoubleClick(item: any) {
    this.selectedItem = item;
    this.component.mode = this.formMode.Detail;
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
        .subscribe(
          (res) => {
            this.component.items = res;
          },
          (err) => {
            console.log(err);
          },
          () => {}
        );
    }
  }

  afterLoadItems() {
    this.subscription = timer(1000).subscribe(() => {
      if (this.component.items?.length > 0) {
        this.component.selectedItem = this.component.items[0];
      }
    });
  }

  updateItem() {
    let url = `${this.component.resourceUrl}/${this.component.selectedItem?.id}`
    this.subscription = this.httpService
      .updateItem<T>(
        url,
        this.component.classType,
        this.component.selectedItem
      )
      .subscribe(
        (res) => {
          this.component.selectedItem = res;
        },
        (err) => {
          console.log(err);
        },
        () => {}
      );
  }

  onSave(){
    if(this.component.mode == FormMode.Edit){
      this.updateItem();
    }else if(this.component.mode == FormMode.Add){

    }
  }
}
