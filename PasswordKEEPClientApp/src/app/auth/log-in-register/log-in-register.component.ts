import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'log-in-register',
  templateUrl: './log-in-register.component.html',
  styleUrls: ['./log-in-register.component.css']
})
export class LogInRegisterComponent implements OnInit {
  public logIn: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  onModeChange(){
    console.log(this.logIn);
  }

}
