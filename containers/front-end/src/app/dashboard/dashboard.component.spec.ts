import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';

import { DashboardComponent } from './dashboard.component';
import { MainDisplayComponent } from '../main-display/main-display.component';
import { SideDisplayComponent } from '../side-display/side-display.component';
import { DashboardService } from '../dashboard.service';
import { MapAreaDirective } from '../map-area.directive';
import { MapAreaComponent } from '../map-area/map-area.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComponent,
      MainDisplayComponent,
      SideDisplayComponent,
      MapAreaDirective,
      MapAreaComponent ],
      providers: [DashboardService],
      imports: [HttpClientModule]
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
