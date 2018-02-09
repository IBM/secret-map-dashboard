import { TestBed, async } from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
// Modules
import { BrowserModule } from '@angular/platform-browser';
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

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DashboardComponent,
        MainDisplayComponent,
        MapAreaComponent,
        SideDisplayComponent,
        MapAreaDirective,
        HomepageComponent,
        HeatmapComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
      ],
      providers: [DashboardService, {provide: APP_BASE_HREF, useValue: '/'}],
    }).compileComponents();
  }));

  describe('#initialization', () => {
    it('should create an AppComponent instance', async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    }));
  });

});
