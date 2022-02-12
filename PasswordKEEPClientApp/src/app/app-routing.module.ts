import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppViewComponent } from './app-view/app-view.component';
import { UserFormComponent } from './user-form/user-form.component';
import { AuthGuard } from './auth/auth.guard';
import { LogInRegisterComponent } from './auth/log-in-register/log-in-register.component';

const appRoutes: Routes = [
  {
    path: 'log-in',
    component: LogInRegisterComponent,
  },
  {
    path: 'applications',
    component: AppViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'usersettings',
    component: UserFormComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: '**', redirectTo: '/applications', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
