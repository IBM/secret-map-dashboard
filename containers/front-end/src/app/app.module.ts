// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDisplayComponent } from './main-display/main-display.component';
import { MapAreaComponent } from './map-area/map-area.component';
import { SideDisplayComponent } from './side-display/side-display.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HeatmapComponent } from './heatmap/heatmap.component';
// Services
import { DashboardService } from './dashboard.service';
// Directives
import { MapAreaDirective } from './map-area.directive';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDisplayComponent,
    MapAreaComponent,
    SideDisplayComponent,
    MapAreaDirective,
    HomepageComponent,
    HeatmapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
