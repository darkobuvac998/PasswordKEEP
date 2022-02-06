import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { JWTTokenService } from './jwttoken.service';
import { LocalStorageService } from './local-storage.service';
import { AuthGuard } from './auth.guard';
import { LogInRegisterComponent } from './log-in-register/log-in-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

@NgModule({
  declarations: [LogInRegisterComponent],
  exports: [LogInRegisterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    AuthService,
    JWTTokenService,
    LocalStorageService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AuthModule {}
