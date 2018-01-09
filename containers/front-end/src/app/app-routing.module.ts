import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component'
import { HomepageComponent } from './homepage/homepage.component'


const routes: Routes = [
  { path: 'dashboard/:eventId', component: DashboardComponent },
  { path: '', component: HomepageComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
