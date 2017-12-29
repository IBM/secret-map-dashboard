import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDisplayComponent } from './main-display/main-display.component';
import { MapAreaComponent } from './map-area/map-area.component';
import { SideDisplayComponent } from './side-display/side-display.component';
import { DashboardService } from './dashboard.service';
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
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
      ],
      providers: [DashboardService],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
