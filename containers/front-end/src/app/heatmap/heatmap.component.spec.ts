import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
// Componenets
import { HeatmapComponent } from './heatmap.component';
// Service
import { DashboardService } from '../dashboard.service';
// Helper Functions
import { parseRGB, increaseColor, decreaseColor} from './heatmap.component';


describe('HeatmapComponent', () => {
  let component: HeatmapComponent;
  let fixture: ComponentFixture<HeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapComponent ],
      providers: [DashboardService],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('#intialization', () => {
    it('should create a HeatmapComponent instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('#helperFunctions', () => {

    it('should increase cell\'s color', () => {
      const colorGreen = [0, 255, 0];
      const colorYellow = [255, 255, 0];
      const colorRed = [255, 0, 0];
      const colorWhite = [255, 255, 255];
      expect(increaseColor(colorGreen, 25)).toEqual([25, 255, 0]); // changing to yellow
      expect(increaseColor(colorYellow, 25)).toEqual([255, 230, 0]); // changing to red
      expect(increaseColor(colorRed, 25)).toEqual([255, 0, 0]); // stays the same
      expect(increaseColor(colorWhite, 25)).toEqual([25, 255, 0]); // changing to green
      expect(increaseColor([255, 25, 0], 25)).toEqual([255, 0, 0]); // changing to red
      expect(increaseColor([255, 25, 0], 45)).toEqual([255, 0, 0]); // testing overflow
      expect(increaseColor([255, 255, 255], 0)).toEqual([255, 255, 255]); // changing to green
    });

    it('should decrease cell\'s color', () => {
      const colorGreen = [0, 255, 0];
      const colorYellow = [255, 255, 0];
      const colorRed = [255, 0, 0];
      const colorWhite = [255, 255, 255];
      expect(decreaseColor(colorGreen, 25)).toEqual([255, 255, 255]); // stays the same
      expect(decreaseColor(colorYellow, 25)).toEqual([230, 255, 0]); // changing to green
      expect(decreaseColor(colorRed, 25)).toEqual([255, 25, 0]); // changing to yellow
      expect(decreaseColor(colorWhite, 25)).toEqual([255, 255, 255]); // changing to green
      expect(decreaseColor([255, 255, 255], 0)).toEqual([255, 255, 255]); // stays the same
      expect(decreaseColor([25, 255, 0], 25)).toEqual([0, 255, 0]); // changing to green
      expect(decreaseColor([25, 255, 0], 35)).toEqual([255, 255, 255]); // testing overflow
    });

    it('should parse rgb string', () => {
      const colorGreen = 'rgb(0,255,0)';
      const colorYellow = 'rgb(255,255,0)';
      const colorRed = 'rgb(255,0,0)';
      expect(parseRGB(colorGreen)).toEqual([0, 255, 0]);
      expect(parseRGB(colorYellow)).toEqual([255, 255, 0]);
      expect(parseRGB(colorRed)).toEqual([255, 0, 0]);
    });

  });

  describe('#componentFunctions', () => {
    it('should return an array of grid coordinates', () => {
      let rows = 1;
      let columns = 1;
      let gridCoordinates = component.getGridCoordinates(rows, columns);
      expect(gridCoordinates).toEqual([{x: 1, y: 1, className: 'gridCell1'}]);
      expect(gridCoordinates.length).toEqual(rows * columns);
      rows = 3;
      columns = 6;
      gridCoordinates = component.getGridCoordinates(rows, columns);
      const lastGridCell = gridCoordinates[(rows * columns) - 1];
      expect(lastGridCell).toEqual({x: columns, y: rows, className: `gridCell${rows * columns - 3}`});
      expect(gridCoordinates.length).toEqual(rows * columns);
    });

    it('should change grid cell\'s color', () => {
      const cell = d3.select('.heatmap').select('.gridCell1');
      component.changeGridCell(1, false, 0);
      expect(cell.style('fill')).toEqual('rgb(255, 255, 255)');
      component.changeGridCell(1, false, 85);
      expect(cell.style('fill')).toEqual('rgb(85, 255, 0)');
    });

    it('should check if n x m grid was created', () => {
      // componenet.makeGrid() is not called here because
      // it is already called when an instance of HeatmapComponent was
      // created
      const cells = d3.selectAll('rect');
      cells.each(function(d){
        expect(d['x']).toBeDefined();
        expect(d['y']).toBeDefined();
        expect(d['className']).toBeDefined();
      });
      expect(cells.size()).toEqual(component.getHEATMAP_COLUMNS() * component.getHEATMAP_ROWS());
    });
  });

});

