import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {APP_BASE_HREF} from '@angular/common';
// Modules
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
// Components
import { DashboardComponent } from './dashboard.component';
import { MainDisplayComponent } from '../main-display/main-display.component';
import { SideDisplayComponent } from '../side-display/side-display.component';
import { MapAreaComponent } from '../map-area/map-area.component';
import { HomepageComponent } from '../homepage/homepage.component';
// Services
import { DashboardService } from '../dashboard.service';
// Directive
import { MapAreaDirective } from '../map-area.directive';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent,
      MainDisplayComponent,
      SideDisplayComponent,
      MapAreaDirective,
      MapAreaComponent,
      HomepageComponent ],
      providers: [DashboardService, {provide: APP_BASE_HREF, useValue: '/'}],
      imports: [HttpClientModule, AppRoutingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
