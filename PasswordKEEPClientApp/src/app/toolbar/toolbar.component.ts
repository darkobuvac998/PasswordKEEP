import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() mode: FormMode;
  @Output() modeChange: EventEmitter<FormMode> = new EventEmitter<FormMode>();

  public formMode = FormMode;

  constructor() { }

  ngOnInit(): void {
  }

  canAdd(){
    return true;
  }

  onModeChange(mode: FormMode){
    this.modeChange.emit(mode);
  }

}
