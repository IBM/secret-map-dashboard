import { RouterModule, Routes } from '@angular/router';
// Modules
import { NgModule } from '@angular/core';
// Components
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomepageComponent } from './homepage/homepage.component';


const routes: Routes = [
  { path: 'dashboard/:eventId', component: DashboardComponent },
  { path: '', component: HomepageComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
