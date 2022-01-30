import { Component, OnInit } from '@angular/core';
import { Application } from '../models/application.model';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'application-base',
  templateUrl: './application-base.component.html',
  styleUrls: ['./application-base.component.css']
})
export class ApplicationBaseComponent implements OnInit {

  public items: Application[];
  public selectedItem: Application = null;
  public mode: FormMode = FormMode.Thumbnail;
  public formMode = FormMode;

  constructor() { }

  ngOnInit(): void {  
  }

  onModeChange(newMode: FormMode){
    let oldMode = this.mode;
    if(newMode != oldMode){
      this.mode = newMode;
    }else{
      return;
    }
  }

}
