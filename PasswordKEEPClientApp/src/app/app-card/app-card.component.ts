import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-card',
  templateUrl: './app-card.component.html',
  styleUrls: ['./app-card.component.css'],
})
export class AppCardComponent implements OnInit {
  @Input() application: Application;
  @Output() onSelected: EventEmitter<Application> =
    new EventEmitter<Application>();
  public selected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onSelecredEvenetHandler() {
    this.onSelected.emit(this.application);
    this.selected = !this.selected;
  }
}
