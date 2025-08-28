import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PointHistoryListComponent } from './point-history-list/point-history-list.component';

const routes: Routes = [
  { path: 'history', component: PointHistoryListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PointsRoutingModule { }
