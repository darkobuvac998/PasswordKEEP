import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.css'],
})
export class AppCardComponent implements OnInit {
  // @Input() application: Application;
  // @Input() account: Account;
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  public selected: boolean = false;
  // @Input() applicationCard: boolean;

  @Input() item: any;

  @ContentChild('cardTemplate') cardTemplate: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}

  onSelecredEvenetHandler() {
    // if(this.applicationCard){
    //   this.onSelected.emit(this.application);
    // }else{
    //   this.onSelected.emit(this.account);
    // }
    this.onSelected.emit(this.item);

    this.selected = !this.selected;
  }

  onItemDoubleClick() {
    this.selected = !this.selected;
    // if(this.applicationCard){
    //   this.onDoubleClick.emit(this.application);
    // }else{
    //   this.onDoubleClick.emit(this.account);
    // }
    this.onDoubleClick.emit(this.item);
  }
}
