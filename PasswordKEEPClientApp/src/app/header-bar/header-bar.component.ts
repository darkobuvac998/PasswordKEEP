import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Confirmable } from '../decorators/method.decorator';
import { HttpService } from '../services/http-service.service';

@Component({
  selector: 'header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css'],
})
export class HeaderBarComponent implements OnInit, AfterViewChecked {
  public userName: string = 'Username';
  public toggleFlag = false;
  public showLoader = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    public httpService: HttpService,
    public checkDetection: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.httpService.onLoading$.subscribe((res) => {
      setTimeout(() => {
        this.showLoader = res;
      }, 50);
    });
  }

  ngAfterViewChecked(): void {
    this.checkDetection.detectChanges();
  }

  @Confirmable('Question', 'Are you sure you want to logout?')
  logout() {
    this.authService.logOut();
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
