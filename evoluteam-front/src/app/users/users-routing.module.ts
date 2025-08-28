   import { NgModule } from '@angular/core';
   import { RouterModule, Routes } from '@angular/router';
   import { UserListComponent } from './user-list/user-list.component';
   import { UserFormComponent } from './user-form/user-form.component';
   import { UserDetailComponent } from './user-detail/user-detail.component';
   import { TeamleadListComponent } from './teamlead-list/teamlead-list.component'; // Import your TeamleadListComponent
   import { AuthGuard } from '../core/auth.guard';
   import { RoleGuard } from '../core/role.guard';

   const routes: Routes = [
     {
       path: '', // This is fine because it's under /users
       component: UserListComponent,
       canActivate: [AuthGuard, RoleGuard],
       data: { roles: ['ADMIN', 'TEAM_LEAD'] }
     },
     {
       path: 'add',
       component: UserFormComponent,
       canActivate: [AuthGuard, RoleGuard],
       data: { roles: ['ADMIN', 'TEAM_LEAD'] }
     },
     {
       path: 'edit/:id',
       component: UserFormComponent,
       canActivate: [AuthGuard, RoleGuard],
       data: { roles: ['ADMIN', 'TEAM_LEAD'] }
     },
     {
       path: ':id',
       component: UserDetailComponent,
       canActivate: [AuthGuard, RoleGuard],
       data: { roles: ['ADMIN', 'TEAM_LEAD'] }
     },
     {
       path: 'teamlead-list', // Add this route for TeamleadListComponent
       component: TeamleadListComponent,
       canActivate: [AuthGuard, RoleGuard],
       data: { roles: ['ADMIN', 'TEAM_LEAD'] }
     }
   ];

   @NgModule({
     imports: [RouterModule.forChild(routes)],
     exports: [RouterModule]
   })
   export class UsersRoutingModule { }
   