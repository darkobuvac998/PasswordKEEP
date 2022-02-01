import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormatDate } from '../decorators/property.decorator';
import { Account } from '../models/account.model';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.css'],
})
export class AppCardComponent implements OnInit {
  @Input() application: Application;
  @Input() account: Account;
  @Output() onSelected: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  public selected: boolean = false;
  @Input() applicationCard: boolean;

  constructor() {}

  ngOnInit(): void {}

  onSelecredEvenetHandler() {
    if(this.applicationCard){
      this.onSelected.emit(this.application);
    }else{
      this.onSelected.emit(this.account);
    }
    
    this.selected = !this.selected;
  }

  onItemDoubleClick(){
    this.selected = !this.selected;
    if(this.applicationCard){
      this.onDoubleClick.emit(this.application);
    }else{
      this.onDoubleClick.emit(this.account);
    }
  }
}
