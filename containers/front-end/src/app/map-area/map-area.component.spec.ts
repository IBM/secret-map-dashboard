import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Components
import { MapAreaComponent } from './map-area.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
// Directives
import { MapAreaDirective } from '../map-area.directive';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from '../dashboard.service';
import { APP_BASE_HREF } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';

describe('MapAreaComponent', () => {
  let component: MapAreaComponent;
  let fixture: ComponentFixture<MapAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAreaComponent,
      MapAreaDirective,
      HeatmapComponent],
      providers: [DashboardService],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#initialization', () => {
    it('should create a MapAreaComponent Instance', () => {
      expect(component).toBeTruthy();
    });
  });

});
