import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { timer } from 'rxjs';
import { AppCardComponent } from '../app-card/app-card.component';
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
  public mode: FormMode = FormMode.Thumbnail;
  public formMode = FormMode;
  @Input() public title: string;

  @ContentChild('listTemplate') listTemplate: TemplateRef<any>;
  @ContentChild('detailTemplate') detailTemplate: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {
    // const time = timer(1000, 1000);
    // time.subscribe(() => {
    //   console.log(this.selectedItem);
    // });
  }

  ngAfterViewInit(): void {
  }

  onModeChange(newMode: FormMode) {
    let oldMode = this.mode;
    if (newMode != oldMode) {
      this.mode = newMode;
    } else {
      return;
    }
  }

  onSelectedItemChange(application: Application) {
    this.selectedItem = application;
  }
}
