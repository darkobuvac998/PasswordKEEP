import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { timer } from 'rxjs';
import { Application } from '../models/application.model';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'application-base',
  templateUrl: './application-base.component.html',
  styleUrls: ['./application-base.component.css'],
})
export class ApplicationBaseComponent implements OnInit, AfterViewInit {
  @Input() public items: any[] = [];
  @Input() public selectedItem: any;
  private _mode: FormMode;
  private _oldMode: FormMode;
  public formMode = FormMode;
  private _title: string;
  public itemAdd: any;
  private _component: ApplicationBaseComponent = this;
  get component(): ApplicationBaseComponent {
    return this._component;
  }

  @Input('component')
  set component(value: ApplicationBaseComponent) {
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

  @ContentChild('listTemplate') listTemplate: TemplateRef<any>;
  @ContentChild('detailTemplate') detailTemplate: TemplateRef<any>;

  constructor() {}

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
