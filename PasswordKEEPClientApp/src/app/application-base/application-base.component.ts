import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ClassConstructor } from 'class-transformer';
import { timer } from 'rxjs';
import { Application } from '../models/application.model';
import { HttpService } from '../services/http-service.service';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'application-base',
  templateUrl: './application-base.component.html',
  styleUrls: ['./application-base.component.css'],
})
export class ApplicationBaseComponent<T> implements OnInit, AfterViewInit {
  @Input() public items: any[] | T[] = [];
  @Input() public selectedItem: T | any;
  private _mode: FormMode;
  private _oldMode: FormMode;
  private _resourceUrl: string;
  private _classType: ClassConstructor<T>;
  private _itemsType: ClassConstructor<T[]>;
  public formMode = FormMode;
  private _title: string;
  public itemAdd: T | any;
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

  public get resourceUrl(){
    return this._resourceUrl;
  }
  public set resourceUrl(value: string){
    this._resourceUrl = value;
  }
  public get classType(){
    return this._classType;
  }
  public set classType(value: ClassConstructor<T>){
    this._classType = value;
  }
  public get itemsType(){
    return this._itemsType;
  }
  public set itemsType(value: ClassConstructor<T[]>){
    this._itemsType = value;
  }

  @ContentChild('listTemplate') listTemplate: TemplateRef<any>;
  @ContentChild('detailTemplate') detailTemplate: TemplateRef<any>;

  constructor(protected httpService: HttpService) {}

  ngOnInit(): void {
    const time = timer(1000, 1000);
    this.mode = this.component.mode;
    time.subscribe(() => {});
  }

  ngAfterViewInit(): void {}

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
}
