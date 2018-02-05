import { Component, OnInit} from '@angular/core';
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
import {setInterval} from 'timers';
@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  heatMapInterval: any;
  HEATMAP_ROWS = 35;
  HEATMAP_COLUMNS = 70;
  COLOR_INCR = 15;

  constructor() {
  }

  ngOnInit() {
    this.makeGrid();
    this.colorHeatMap();
  }

  /**
   * Makes a square grid
   * @param {very_long_type} name           Description.
   * @param {type}           very_long_name Description.
   */
  makeGrid() {
    const width = Math.floor(d3.select('.heatmap').property('clientWidth'));
    const height =  Math.floor(d3.select('.heatmap').property('clientHeight'));
    const gridRows = Math.floor(height / (height / this.HEATMAP_ROWS));
    const  gridColumns = Math.floor(width / (width / this.HEATMAP_COLUMNS));
    const svg = d3.select('.heatmap').append('g');
    const data = this.getGridCoordinates(gridRows, gridColumns);
    const cards = svg.selectAll('.cell')
      .data(data, function(d) {return d.x + ':' + d.y; });
      cards.enter().append('rect')
      .attr('x', function(d) { return (d.x - 1) * width / gridColumns; })
      .attr('y', function(d) { return (d.y - 1) * height / gridRows; })
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', width / gridColumns)
      .attr('height', height / gridRows )
      .attr('class', function(d){ return d.className; })
      .style('stroke', '#E6E6E6')
      .style('stroke-width', '2')
      .style('fill', String(d3.rgb(255, 255, 255)));
  }

  /**
   * Changes specified grid cell style fill to a different color
   * @param {very_long_type} name           Description.
   * @param {type}           very_long_name Description.
   */

  changeCell(x, y) {
    const svg = d3.select('.heatmap');
    const cell = svg.select(`.gridCell${x}-${y}`);
    cell.each(function(d, i) {
      const gridCell = d3.select('.' + d['className']);
      const rgbArray = parseRGB(gridCell.style('fill'));
      const colorValue = increaseColor(rgbArray);
      d3.select('.' + d['className']).style('fill', String(d3.rgb(colorValue[0], colorValue[1], colorValue[2])));
    });
  }

  /**
   * Creates grid coordinates for building square grid
   * @param {very_long_type} name           Description.
   * @param {type}           very_long_name Description.
   */
  getGridCoordinates(rows, columns) {
    const data = new Array();
    for (let x = 1; x <= columns; x++) {
      for (let y = 1; y <= rows; y++) {
        data.push({x : x, y: y, className: `gridCell${x}-${y}`, colorValue: [0, 255, 0]});
      }
    }
    return data;
  }

  /**
   * Creates a random step and colors grid cell every second
   * @param {very_long_type} name           Description.
   * @param {type}           very_long_name Description.
   */
  colorHeatMap() {
    this.heatMapInterval = setInterval(() => {
      const step = randomStep(this.HEATMAP_ROWS - 1, this.HEATMAP_COLUMNS - 1);
      this.changeCell(step.x, step.y);
    }, 1000);
  }

}

/**
 * Creates a random step
 * @param {very_long_type} name           Description.
 * @param {type}           very_long_name Description.
 */
function randomStep(rows, columns) {
  return {
    x: getRandomInt(columns),
    y: getRandomInt(rows),
  };
}

/**
 * Gets a random number between 0 and upper bound
 * @param {very_long_type} name           Description.
 * @param {type}           very_long_name Description.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Parses RGB string and creates a rgb array
 * @param {very_long_type} name           Description.
 * @param {type}           very_long_name Description.
 */
function parseRGB(rgbString) {
  rgbString = rgbString.replace(' ', '');
  rgbString = rgbString.replace(' ', '');
  const re = /\d+,\d+,\d+/;
  const result = rgbString.match(re)[0];
  const rgbArray = result.split(',');
  return rgbArray.map(Number);
}

/**
 * Changes cell from green to yellow to red
 * @param {very_long_type} name           Description.
 * @param {type}           very_long_name Description.
 */
function increaseColor(rgbArray) {
  if (rgbArray[0] === 255 && rgbArray[1] === 255 && rgbArray[2] === 255) {
    return [0, 255, 0];
  }
  if  ( ( Math.abs(rgbArray[0]) < 255 )  && (Math.abs(rgbArray[1]) <= 255 && Math.abs(rgbArray[1]) > 0 )) {
    // change grid cell to yellow
    rgbArray[0] += this.COLOR_INCR;
    return [rgbArray[0], rgbArray[1], 0];
  } else if  ( Math.abs(rgbArray[1]) > 0 ) {
    // change grid cell to red
    rgbArray[1] -= this.COLOR_INCR;
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}
