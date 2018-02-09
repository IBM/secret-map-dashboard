import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import {setInterval} from 'timers';
@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  private heatMapInterval: any;
  private HEATMAP_ROWS = 35;
  private HEATMAP_COLUMNS = 70;

  constructor() {
  }

  ngOnInit() {
    this.makeGrid();
    // this.colorHeatMap();
  }

  /**
   * Makes a grid with svg.rect elements
   */
  public makeGrid(): void{
    const width = Math.floor(d3.select('.heatmap').property('clientWidth'));
    const height =  Math.floor(d3.select('.heatmap').property('clientHeight'));
    const gridRows = Math.floor(height / (height / this.HEATMAP_ROWS));
    const gridColumns = Math.floor(width / (width / this.HEATMAP_COLUMNS));
    const svg = d3.select('.heatmap').append('g');
    const data = this.getGridCoordinates(gridRows, gridColumns);
    const cards = svg.selectAll('.cell')
      .data(data, function(d) {return d['x'] + ':' + d['y']; });
      cards.enter().append('rect')
      .attr('x', function(d) { return (d['x'] - 1) * width / gridColumns; })
      .attr('y', function(d) { return (d['y'] - 1) * height / gridRows; })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', width / gridColumns)
      .attr('height', height / gridRows )
      .attr('class', function(d){ return d['className']; })
      .style('stroke', '#E6E6E6')
      .style('stroke-width', '2')
      .style('fill', String(d3.rgb(255, 255, 255)));
  }

  /**
   * Changes specified grid cell style fill to a different color
   * @param number x
   * @param number y
   */

  public changeGridCell(x, y): void{
    const svg = d3.select('.heatmap');
    const cell = svg.select(`.gridCell${x}-${y}`);
    const rgbArray = parseRGB(cell.style('fill'));
    const colorValue = increaseColor(rgbArray);
    cell.style('fill', String(d3.rgb(colorValue[0], colorValue[1], colorValue[2])));
  }

  /**
   * Creates grid coordinates for building square grid
   * @param number rows     must be greater than 0
   * @param number columns     must be greater than 0
   */
  public getGridCoordinates(rows, columns): Array<object>{
    const data = new Array();
    for (let x = 1; x <= columns; x++) {
      for (let y = 1; y <= rows; y++) {
        data.push({x : x, y: y, className: `gridCell${x}-${y}`});
      }
    }
    return data;
  }

  /**
   * Creates a random step and colors grid cell every second
   */
  public colorHeatMap(): void{
    this.heatMapInterval = setInterval(() => {
      const step = randomStep(this.HEATMAP_ROWS - 1, this.HEATMAP_COLUMNS - 1);
      this.changeGridCell(step['x'], step['y']);
    }, 1000);
  }

  /**
   * Returns HEATMAP_ROWS
   */
  public getHEATMAP_ROWS(): number {
    return this.HEATMAP_ROWS;
  }

  /**
   * Sets HEATMAP_ROWS
   * @param number rows
   */
  public setHEATMAP_ROWS(rows: number): void{
    this.HEATMAP_ROWS = rows;
  }

  /**
   * Returns HEATMAP_COLUMNS
   */
  public getHEATMAP_COLUMNS(): number {
    return this.HEATMAP_COLUMNS;
  }

  /**
   * Set HEATMAP_COLUMNS
   * @param number columns
   */
  public setHEATMAP_COLUMNS(columns: number): void{
    this.HEATMAP_COLUMNS = columns;
  }
}

/**
 * Creates a random step
 * @param number rows      must be greater than 0
 * @param number columns      must be greater than 0
 */
export function randomStep(rows, columns): object{
  return {
    x: getRandomInt(columns),
    y: getRandomInt(rows),
  };
}

/**
 * Gets a random number between 1 and upperBound
 * @param number upperBound      must be greater than 0
 */
export function getRandomInt(upperBound: number): number{
  let randomNum = Math.floor(Math.random() * Math.floor(upperBound));
  return (randomNum > 0 ? randomNum : 1);
}

/**
 * Parses RGB string and creates a rgb array
 * @param string rgbString      must in a rgb(?,?,?) formation Ex. "rgb(255,255,255)".
 */
export function parseRGB(rgbString: string): Array<number> {
  rgbString = rgbString.replace(' ', '');
  rgbString = rgbString.replace(' ', '');
  const re = /\d+,\d+,\d+/;
  const result = rgbString.match(re)[0];
  const rgbArray = result.split(',');
  return rgbArray.map(Number);
}

/**
 * Changes cell from green to yellow to red
 * @param Array<number> rgbArray    size of Array must be 3
 */
export function increaseColor(rgbArray: Array<number>) {
  let colorVariance = 15;
  if (rgbArray[0] === 255 && rgbArray[1] === 255 && rgbArray[2] === 255) {
    return [0, 255, 0];
  }
  if ((Math.abs(rgbArray[0]) < 255 )  && (Math.abs(rgbArray[1]) <= 255 && Math.abs(rgbArray[1]) > 0 )) {
    // change grid cell to yellow
    rgbArray[0] += colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else if (Math.abs(rgbArray[1]) > 0 ) {
    // change grid cell to red
    rgbArray[1] -= colorVariance;
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}
