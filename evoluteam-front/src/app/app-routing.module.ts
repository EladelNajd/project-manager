import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AuthGuard } from './core/auth.guard';
import { RoleGuard } from './core/role.guard';
import { PublicLayoutComponent } from './shared/layout/public-layout/public-layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    component: PublicLayoutComponent,
    pathMatch: 'full'
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: 'teamlead-list', // Add this route for TeamleadListComponent
     loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'projectmanager',
    loadChildren: () => import('./projectmanager/projectmanager.module').then(m => m.ProjectmanagerModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
    path: 'points',
    loadChildren: () => import('./points/points.module').then(m => m.PointsModule),
    canActivate: [AuthGuard]
  },
  {
  path: 'reviews',
  loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule),
  canActivate: [AuthGuard] // Already handled with RoleGuard inside
},

  {
    path: 'teams',
    loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'TEAM_LEAD'] }
  },
  {
  path: 'skills',
  loadChildren: () => import('./skills/skills.module').then(m => m.SkillsModule),
  canActivate: [AuthGuard] // add guards as needed
},

  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
