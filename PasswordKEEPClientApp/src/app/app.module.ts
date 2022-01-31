import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { ApplicationBaseComponent } from './application-base/application-base.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ApplicationCardComponent } from './application-card/application-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderBarComponent,
    ApplicationBaseComponent,
    ToolbarComponent,
    ApplicationCardComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
