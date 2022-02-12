import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from './global-error-handler.service';
import { DialogComponent } from './dialog/dialog.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [DialogComponent, LoaderComponent],
  exports: [DialogComponent, LoaderComponent],
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class SharedModule {}
