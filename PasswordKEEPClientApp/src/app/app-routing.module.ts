import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppViewComponent } from './app-view/app-view.component';
import { UserFormComponent } from './user-form/user-form.component';

const appRoutes: Routes = [
  {
    path: 'applications',
    component: AppViewComponent,
  },
  { path: 'usersettings', component: UserFormComponent },
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: '**', redirectTo: '/applications', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
