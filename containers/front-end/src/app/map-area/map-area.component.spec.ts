import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// Components
import { MapAreaComponent } from './map-area.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
// Directives
import { MapAreaDirective } from '../map-area.directive';

describe('MapAreaComponent', () => {
  let component: MapAreaComponent;
  let fixture: ComponentFixture<MapAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapAreaComponent,
      MapAreaDirective,
      HeatmapComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
