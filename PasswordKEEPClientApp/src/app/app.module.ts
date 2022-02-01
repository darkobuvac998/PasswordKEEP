import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { ApplicationBaseComponent } from './application-base/application-base.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AppCardComponent } from './app-card/app-card.component';
import { AppViewComponent } from './app-view/app-view.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountViewComponent } from './account-view/account-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    ApplicationBaseComponent,
    ToolbarComponent,
    AppCardComponent,
    AppViewComponent,
    AccountViewComponent,
  ],
  imports: [BrowserModule, NgbModule, CommonModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
