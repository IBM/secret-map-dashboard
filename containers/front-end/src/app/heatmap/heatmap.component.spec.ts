import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
// Componenets
import { HeatmapComponent } from './heatmap.component';
// Helper Functions
import { getRandomInt, randomStep, parseRGB, increaseColor} from './heatmap.component';


describe('HeatmapComponent', () => {
  let component: HeatmapComponent;
  let fixture: ComponentFixture<HeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapComponent ]
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

    it('should create a random step', () => {
      const step = randomStep(1, 1);
      expect(step['x']).toEqual(1);
      expect(step['y']).toEqual(1);
      const upperBoundRow = 100;
      const upperBoundCol = 100;
      for (let i = 1; i <= upperBoundRow; i ++) {
        for (let j = 1; j <= upperBoundCol; j++) {
          const step2 = randomStep(i, j);
          expect(step2['x']).toBeGreaterThan(0);
          expect(step2['y']).toBeGreaterThan(0);
          expect(step2['x']).toBeLessThanOrEqual(upperBoundRow);
          expect(step2['y']).toBeLessThanOrEqual(upperBoundCol);
        }
      }
    });

    it('should increase color', () => {
      const colorGreen = [0, 255, 0];
      const colorYellow = [255, 255, 0];
      const colorRed = [255, 0, 0];
      const colorWhite = [255, 255, 255];
      expect(increaseColor(colorGreen)).toEqual([15, 255, 0]);
      expect(increaseColor(colorYellow)).toEqual([255, 240, 0]);
      expect(increaseColor(colorRed)).toEqual([255, 0, 0]);
      expect(increaseColor(colorWhite)).toEqual([0, 255, 0]);
    });

    it('should parse rgb string', () => {
      const colorGreen = 'rgb(0,255,0)';
      const colorYellow = 'rgb(255,255,0)';
      const colorRed = 'rgb(255,0,0)';
      expect(parseRGB(colorGreen)).toEqual([0, 255, 0]);
      expect(parseRGB(colorYellow)).toEqual([255, 255, 0]);
      expect(parseRGB(colorRed)).toEqual([255, 0, 0]);
    });

    it('should return a random integer from 0 to max number', () => {
      const iterations = 100;
      for (let i = 0; i < iterations; i++) {
        const randomNum = getRandomInt(i);
        expect(randomNum).toBeGreaterThan(0);
        expect(randomNum).toBeLessThanOrEqual(iterations);
      }
    });

  });

  describe('#componentFunctions', () => {

    it('should return an array of grid coordinates', () => {
      let rows = 1;
      let columns = 1;
      let gridCoordinates = component.getGridCoordinates(rows, columns);
      expect(gridCoordinates).toEqual([{x: 1, y: 1, className: 'gridCell1-1'}]);
      expect(gridCoordinates.length).toEqual(rows * columns);
      rows = 25;
      columns = 25;
      gridCoordinates = component.getGridCoordinates(rows, columns);
      const lastGridCell = gridCoordinates[(rows * columns) - 1];
      expect(lastGridCell).toEqual({x: rows, y: columns, className: `gridCell${rows}-${columns}`});
      expect(gridCoordinates.length).toEqual(rows * columns);
    });

    it('should change grid cell\'s color', () => {
      const cell = d3.select('.heatmap').select('.gridCell1-1');
      component.changeGridCell(1, 1);
      expect(cell.style('fill')).toEqual('rgb(0, 255, 0)');
      component.changeGridCell(1, 1);
      expect(cell.style('fill')).toEqual('rgb(15, 255, 0)');
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

