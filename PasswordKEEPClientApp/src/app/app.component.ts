import { Component } from '@angular/core';
import { LogInRegisterComponent } from './auth/log-in-register/log-in-register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'PasswordKEEPClientApp';
  public showHeader: boolean = true;

  onOutletComponentChange(component: any){
    // console.log(component);
    if(component instanceof LogInRegisterComponent){
      this.showHeader = false;
    }else{
      this.showHeader = true;
    }
  }
}
