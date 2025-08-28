import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectFormComponent } from './project/project-form/project-form.component';
import { ProjectListComponent } from './project/project-list/project-list.component';
import { ProjectHistoryListComponent } from './project-history/project-history-list/project-history-list.component';
import { ProjectHistoryFormComponent } from './project-history/project-history-form/project-history-form.component'; // import form component
import { TaskFormComponent } from './task/task-form/task-form.component';
import { TaskListComponent } from './task/task-list/task-list.component';

const routes: Routes = [
  { path: 'projects', component: ProjectListComponent },
  { path: 'projects/new', component: ProjectFormComponent },
  { path: 'projects/:id', component: ProjectFormComponent },
  { path: 'project-history', component: ProjectHistoryListComponent },
  { path: 'project-history/new', component: ProjectHistoryFormComponent },  // <-- added this route
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectmanagerRoutingModule { }
