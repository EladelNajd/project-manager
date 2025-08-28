import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillListComponent } from './skill-list/skill-list.component';
import { SkillRequestListComponent } from './skill-request-list/skill-request-list.component';

const routes: Routes = [
  {
    path: '',              // matches /skills
    component: SkillListComponent
  },
  {
    path: 'requests',      // matches /skills/requests
    component: SkillRequestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule { }
