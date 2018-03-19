import { Component, OnInit, HostListener} from '@angular/core';
import * as d3 from 'd3';
import {setInterval} from 'timers';
import { DashboardService } from '../dashboard.service';
import { color } from 'd3';
@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  private HEATMAP_INTERVAL = 2500;
  private DEGRADED_INTERVAL = 10000;
  private EXITS_PER_MINUTE = 5;
  private NUMBER_OF_ZONES = 15;
  private heatMapInterval: any;
  private HEATMAP_ROWS = 3;
  private HEATMAP_COLUMNS = 6;
  private wordNumbers: Array<string>;
  private zoneExits: object;
  private zoneEntries: Array<object>;
  private zoneTriggers: object;

  constructor(private dashboardService: DashboardService) {
    this.zoneExits = {};
    this.zoneEntries = [];
    this.wordNumbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
  }

  ngOnInit() {
    this.initializeZoneExits(this.NUMBER_OF_ZONES);
    this.makeGrid();
    setInterval( () => {
      this.colorHeatMap();
    }, this.HEATMAP_INTERVAL);

    setInterval( () => {
      this.changeDegradedCell();
    }, this.DEGRADED_INTERVAL);
  }

  /**
   * Makes a grid with svg.rect elements
   */
  public makeGrid(): void {
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
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', width / gridColumns)
      .attr('height', height / gridRows)
      .attr('class', function(d){ return d['className']; })
      .style('stroke', '#E6E6E6')
      .style('stroke-width', '3')
      .style('fill', String(d3.rgb(255, 255, 255)));
  }

  public resizeGrid(): void {
    const width = Math.floor(d3.select('.heatmap').property('clientWidth'));
    const height = Math.floor(d3.select('.heatmap').property('clientHeight'));
    const gridRows = Math.floor(height / (height / this.HEATMAP_ROWS));
    const gridColumns = Math.floor(width / (width / this.HEATMAP_COLUMNS));
    const heatmap = d3.select('.heatmap').select('g').selectAll('rect');
    heatmap.each((data, index) => {
      const gridCell = d3.select(`.${data['className']}`);
      gridCell.attr('x', function (d) { return (d['x'] - 1) * width / gridColumns; })
        .attr('y', function (d) { return (d['y'] - 1) * height / gridRows; })
        .attr('width', width / gridColumns)
        .attr('height', function (d) { return height / gridRows; });
    });
  }

  /**
   * Changes specified grid cell style fill to a different color
   * @param number x
   * @param number y
   */

  public changeGridCell(zoneId: number,  decreaseFlag: boolean, colorVariance: number): void {
    const cell = d3.select('.heatmap').select(`.gridCell${zoneId}`);
    const rgbArray = parseRGB(cell.style('fill'));
    let colorValue = [];
    if (decreaseFlag) {
      colorValue = decreaseColor(rgbArray, colorVariance);
    } else {
      colorValue = increaseColor(rgbArray, colorVariance);
    }
    cell.style('fill', String(d3.rgb(colorValue[0], colorValue[1], colorValue[2])));
  }

  /**
   * Creates grid coordinates for building square grid
   * @param number rows     must be greater than 0
   * @param number columns     must be greater than 0
   */
  public getGridCoordinates(rows, columns): Array<object> {
    const data = new Array();
    let counter = 1;
    for (let y = 1; y <= rows; y++) {
      for (let x = 1; x <= columns; x++) {
        let className = '';
        if (counter > 6) {
          className = `gridCell${counter - 3}`;
        } else if (counter > 3 && counter < 7) {
          className = `gridCell${counter}X`;
        } else {
          className = `gridCell${counter}`;
        }
        data.push({ x: x, y: y, className: className });
        counter++;
      }
    }
    return data;
  }

  /**
 * Gets zone triggers
 */
  public getZoneTriggers(): void {
    this.dashboardService.getTotalTriggers()
      .subscribe(zoneTriggers => {
        this.zoneTriggers = zoneTriggers;
      });
  }

  /**
   * Creates a random step and colors grid cell every second
   */
  public colorHeatMap(): void {
    let entries = 0;
    let colorVariance = 0;
    let exits = 0;
    this.getZoneTriggers();
    if (this.zoneTriggers || this.zoneTriggers != null) {
      for (let trigger = 0; trigger < Object.keys(this.zoneTriggers).length / 2; trigger++) {
        entries = this.zoneTriggers[`zone_${this.wordNumbers[trigger]}_enter`];
        exits = this.zoneExits[`${trigger + 1}`];
        colorVariance = Math.floor((entries - exits) / this.EXITS_PER_MINUTE);
        const entry = { zoneId: trigger + 1, colorVariance: colorVariance };
        this.pushZoneEntries(entry);
        this.changeGridCell(trigger + 1, false, colorVariance);
        this.zoneExits[`${trigger + 1}`] = entries;
      }
    }

}
  /**
   * Creates a random step and colors grid cell every second
   */
  public changeDegradedCell(): void {
    for (let zone = 1; zone <= this.NUMBER_OF_ZONES; zone++) {
      const entry = this.popZoneEntries();
      this.changeGridCell(entry['zoneId'], true, entry['colorVariance']);
    }
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
  public setHEATMAP_ROWS(rows: number): void {
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
  public setHEATMAP_COLUMNS(columns: number): void {
    this.HEATMAP_COLUMNS = columns;
  }

  public initializeZoneExits(zones: number) {
    for (let x = 1; x <= zones; x++) {
      this.zoneExits[`${x}`] = 0;
    }
  }

  public pushZoneEntries(zoneEntry: object) {
    this.zoneEntries.push(zoneEntry);
  }

  public popZoneEntries(): object {
    return this.zoneEntries.shift();
  }

  public pushZoneExits(zoneExit: object) {
    this.zoneEntries.push(zoneExit);
  }

  public popZoneExits(): object {
    return this.zoneEntries.shift();
  }


  /**
  * Checks when browser changes in size and will make the maparea responsive
  * @param - none
  */
  @HostListener('window:resize')
  public onResize(): void {
    this.resizeGrid();
  }
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
export function increaseColor(rgbArray: Array<number>, colorVariance: number) {
  if (rgbArray[0] === 255 && rgbArray[1] === 255 && rgbArray[2] === 255) {
    if (colorVariance === 0) {
      return [255, 255, 255];
    } else if (colorVariance > 255) {
      rgbArray[0] = (colorVariance - (255 - colorVariance));
    } else {
      rgbArray[0] = colorVariance;
    }
    return [rgbArray[0], 255, 0];
  } else if (rgbArray[0] < 255  && (rgbArray[1] <= 255 && rgbArray[1] > 0 ) && rgbArray[2] === 0) {
    // change grid cell to yellow
    if ((rgbArray[0] + colorVariance) > 255) {
      rgbArray[0] += (colorVariance - (rgbArray[0] + colorVariance) - 255 );
    } else {
      rgbArray[0] += colorVariance;
    }
    return [rgbArray[0], rgbArray[1], 0];
  } else if (rgbArray[1] > 0 ) {
    // change grid cell to red
    if ((rgbArray[1] - colorVariance) < 0) {
      rgbArray[1] -= rgbArray[1];
    } else {
      rgbArray[1] -= colorVariance;
    }
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}

/**
 * Changes cell from red to yellow to green
 * @param Array<number> rgbArray    size of Array must be 3
 */
export function decreaseColor(rgbArray: Array<number>, colorVariance: number) {
  if (rgbArray[0] === 0 && rgbArray[1] === 255 && rgbArray[2] === 0 ) {
    return [255, 255, 255];
  } else if (rgbArray[0] === 255 && (rgbArray[1] < 255 && rgbArray[1] >= 0) && rgbArray[2] === 0) {
    // change grid cell to yellow
    if ((rgbArray[1] + colorVariance) > 255) {
      rgbArray[1] += (colorVariance - (rgbArray[1] + colorVariance) - 255);
    } else {
      rgbArray[1] += colorVariance;
    }
    return [rgbArray[0], rgbArray[1], 0];
  } else if (rgbArray[0] > 0  && rgbArray[1] === 255  && rgbArray[2] === 0) {
    // change grid cell to green
    if ((rgbArray[0] - colorVariance) < 0) {
      return [255, 255, 255];
    } else {
      rgbArray[0] -= colorVariance;
    }
    return [rgbArray[0], rgbArray[1], 0];
  } else {
    return rgbArray;
  }
}
