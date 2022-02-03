import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from './global-error-handler.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class SharedModule {}
