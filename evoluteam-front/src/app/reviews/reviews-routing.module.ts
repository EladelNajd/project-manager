import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewListComponent } from './review-list/review-list.component';
import { ReviewFormComponent } from './review-form/review-form.component';
import { RoleGuard } from '../core/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ReviewListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD', 'USER'] }
  },
  {
    path: 'add',
    component: ReviewFormComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD', 'USER'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
