import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../models/application.model';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.css']
})
export class ApplicationCardComponent implements OnInit {

  @Input() application: Application = new Application();

  constructor() { }

  ngOnInit(): void {
    this.application.name = 'LinkedIn';
    this.application.url = 'https://linkedin.com';
    this.application.accounts = [];
    this.application.id = '1';
  }

}
