import { Directive, Input, ElementRef, AfterViewChecked, HostListener, OnInit} from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { interceptingHandler } from '@angular/common/http/src/module';
import * as d3 from 'd3';
// Objects
import { Booth, Beacon} from './conferenceItems';
@Directive({
  selector: '[appMapArea]'
})
export class MapAreaDirective implements AfterViewChecked {

  @Input() booths: Booth[];
  @Input() beacons: Beacon[];
  @Input() eventName: string;
  @Input() mapHeight: number;
  @Input() mapWidth: number;
  heightRatio: number;
  widthRatio: number;

  constructor(private el: ElementRef) {
  }

   /**
   * Checks whether incoming data such as booth or beacon data is changing
   * @param - none
   */
  ngAfterViewChecked() {
    this.changeEventBlockSize();
    this.changeTspanTextSize();
  }

   /**
   * Changes booth blocks in proporation to the window size
   * @param parent - HTML Element
   */
  changeEventBlockSize() {
    const mapArea = d3.select('.mapArea');
    if (mapArea.size() ===  0) {
      return;
    }
    const eventBlocks = mapArea.selectAll('.eventBlock');
    this.heightRatio = Math.floor(mapArea.property('clientHeight')) / this.mapHeight;
    this.widthRatio = Math.floor(mapArea.property('clientWidth')) / this.mapWidth;
    eventBlocks.each((d, i) => {
      const eventBlock = d3.select(`#eventBlock${i}`);
      const index = i;
      if (eventBlock.attr('name') === 'circle') {
        eventBlock.attr('cx', Math.floor(this.booths[index].shape['cx'] * this.widthRatio));
        eventBlock.attr('cy', Math.floor(this.booths[index].shape['cy'] * this.heightRatio));
        eventBlock.attr('r', Math.floor(this.booths[index].shape['radius'] * ((this.widthRatio + this.heightRatio) / 4)));
      } else if (eventBlock.attr('name') === 'ellipse') {
        eventBlock.attr('cx', Math.floor(this.booths[index].shape['cx'] * this.widthRatio));
        eventBlock.attr('cy', Math.floor(this.booths[index].shape['cy'] * this.heightRatio));
        eventBlock.attr('rx', Math.floor(this.booths[index].shape['rx'] * this.widthRatio));
        eventBlock.attr('ry', Math.floor(this.booths[index].shape['ry'] * this.heightRatio));
      } else if (eventBlock.attr('name') === 'polygon') {
        const points = this.booths[index].shape['points'].split(/[\s,]+/);
        let scaledPoints = '';
        for (let x = 0; x < points.length; x++) {
          if ( x % 2 === 0) {
            scaledPoints += points[x] * this.widthRatio + ',';
          } else {
            scaledPoints += points[x] * this.heightRatio + ' ';
          }
        }
        eventBlock.attr('points', scaledPoints);
      } else {
        eventBlock.attr('width', Math.floor(this.booths[index].shape['width'] * this.widthRatio));
        eventBlock.attr('height', Math.floor(this.booths[index].shape['height'] * this.heightRatio));
        eventBlock.attr('x', Math.floor(this.booths[index].shape['x'] * this.widthRatio));
        eventBlock.attr('y', Math.floor(this.booths[index].shape['y'] * this.heightRatio));
      }
    });
  }

  /**
* Centers booth description
* @param parent - HTML Element
*/
  changeTspanTextSize() {
    const mapArea = d3.select('.mapArea');
    if (mapArea.size() === 0) {
      return;
    }
    const boothTexts = mapArea.selectAll('.boothText');
    const eventBlocks = mapArea.selectAll('.eventBlock');
    if (boothTexts.size() === 0 || eventBlocks.size() === 0) {
      return;
    }
    let centerEventBlockHeight = 0;
    let centerEventBlockWidth = 0;

    for (let i = 0; i < boothTexts.size(); i++) {
      const boothText = d3.select(`#boothText${i}`);
      const eventBlock = d3.select(`#eventBlock${i}`);
      const tspans = boothText.selectAll('.tspanText');
      if (eventBlock.attr('name') === 'circle') {
        centerEventBlockHeight = Number(eventBlock.attr('cy')) + Number(eventBlock.attr('r')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('cx')) + Number(eventBlock.attr('r')) / 2;
      } else if (eventBlock.attr('name') === 'ellipse') {
        centerEventBlockHeight = Number(eventBlock.attr('cy')) + Number(eventBlock.attr('ry')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('cx')) + Number(eventBlock.attr('rx')) / 2;
      } else if (eventBlock.attr('name') === 'polygon') {
        centerEventBlockHeight = eventBlocks['_groups'][0][i].getBoundingClientRect().top;
        centerEventBlockWidth = eventBlocks['_groups'][0][i].getBoundingClientRect().left +
          eventBlocks['_groups'][0][i].getBoundingClientRect().width / 2;
      } else {
        centerEventBlockHeight = Number(eventBlock.attr('y')) + Number(eventBlock.attr('height')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('x')) + Number(eventBlock.attr('width')) / 2;
      }

      boothText.attr('x', Math.floor(centerEventBlockWidth));
      boothText.attr('y', Math.floor(centerEventBlockHeight));
      for (let x = 0; x < tspans.size(); x++) {
          const tspanText = boothText.select(`#tspanText${x}`);
          let dy = '1.2em';
          if (x === 0 && tspans.size() === 3) {
            dy = '-1.2em';
          } else if (x === 0 && tspans.size() === 2) {
            dy = '-0.6em';
          } else if (x === 0 && tspans.size() === 1) {
            dy = '0';
          }
          tspanText.attr('dy', dy)
            .attr('x', Math.floor(centerEventBlockWidth));
      }
    }
  }

   /**
   * Checks when browser changes in size and will make the maparea responsive
   * @param - none
   */
  @HostListener('window:resize')
  onResize() {
    this.changeEventBlockSize();
    this.changeTspanTextSize();
  }

}
