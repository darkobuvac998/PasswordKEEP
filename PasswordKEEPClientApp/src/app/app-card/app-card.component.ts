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
  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDoubleClick: EventEmitter<any> = new EventEmitter<any>();
  public selected: boolean = false;
  @Input() item: any;
  @ContentChild('cardTemplate') cardTemplate: TemplateRef<any>;
  constructor() {}
  ngOnInit(): void {}
  onSelecredEvenetHandler() {
    this.onSelected.emit(this.item);
    this.selected = !this.selected;
  }
  onItemDoubleClick() {
    this.selected = !this.selected;
    this.onDoubleClick.emit(this.item);
  }
}
