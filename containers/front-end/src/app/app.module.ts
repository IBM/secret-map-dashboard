import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDisplayComponent } from './main-display/main-display.component';
import { MapAreaComponent } from './map-area/map-area.component';
import { SideDisplayComponent } from './side-display/side-display.component';
import { DashboardService } from './dashboard.service';
import { MapAreaDirective } from './map-area.directive';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDisplayComponent,
    MapAreaComponent,
    SideDisplayComponent,
    MapAreaDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
