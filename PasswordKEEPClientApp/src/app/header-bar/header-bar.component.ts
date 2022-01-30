import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
})
export class HeaderBarComponent implements OnInit {
  public userName: string = 'Username';

  constructor() {}

  ngOnInit(): void {}

  logout() {
    of(window.confirm('Are you sure you want to log out?')).subscribe(
      (result) => {
        if (result) {
          console.log('You loged out');
        } else {
          console.log('You stay in!');
        }
      }
    );
  }
}
