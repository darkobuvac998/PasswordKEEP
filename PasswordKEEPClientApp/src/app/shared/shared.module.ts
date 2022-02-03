import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from './global-error-handler.service';
import { DialogComponent } from './dialog/dialog.component';
// import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [DialogComponent],
  exports: [DialogComponent],
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class SharedModule {}
