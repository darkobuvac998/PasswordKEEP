import { Component, Input, OnInit } from '@angular/core';
import { FormMode } from '../shared/form-mode';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input() mode: FormMode;

  constructor() { }

  ngOnInit(): void {
  }

  canAdd(){
    return true;
  }

}
