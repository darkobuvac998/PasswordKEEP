import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { Confirmable } from '../decorators/method.decorator';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
})
export class HeaderBarComponent implements OnInit {
  public userName: string = 'Username';
  public toggleFlag = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  @Confirmable('Question', 'Are you sure you want to logout?')
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

  showDropdown() {
    this.toggleFlag = !this.toggleFlag;
    let closeDelay = timer(4000);
    closeDelay.subscribe(() => {
      if (this.toggleFlag) {
        this.toggleFlag = !this.toggleFlag;
      }
    });
  }

  settings() {
    this.router
      .navigateByUrl('/usersettings')
      .then(() => {
        this.toggleFlag = !this.toggleFlag;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
