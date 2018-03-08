import { Directive, Input, ElementRef, AfterViewChecked, HostListener} from '@angular/core';
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
    this.changeBeaconBlockSize();
    this.changeBoothTextSize();
    this.changeRadiusBlockSize();
  }

   /**
   * Changes booth blocks in proporation to the window size
   * @param parent - HTML Element
   */
  changeEventBlockSize() {
    const mapArea = d3.select('.mapArea');
    const ratio = this.eventName === 'Index' ? 25 : 50;
    if (mapArea.size() ===  0) {
      return;
    }
    const eventBlocks = mapArea.selectAll('.eventBlock');
    this.widthRatio = Math.floor(mapArea.property('clientWidth')) / ratio;
    this.heightRatio = Math.floor(mapArea.property('clientHeight')) / ratio;

    eventBlocks.each((d, i) => {
      const eventBlock = d3.select(`#eventBlock${i}`);
      const index = i;
      if (eventBlock.attr('name') === 'circle') {
        eventBlock.attr('cx', this.booths[index].shape['cx'] * this.widthRatio);
        eventBlock.attr('cy', this.booths[index].shape['cy'] * this.heightRatio);
        eventBlock.attr('r', this.booths[index].shape['radius'] * ((this.widthRatio + this.heightRatio) / 4));
      } else if (eventBlock.attr('name') === 'ellipse') {
        eventBlock.attr('cx', this.booths[index].shape['cx'] * this.widthRatio);
        eventBlock.attr('cy', this.booths[index].shape['cy'] * this.heightRatio);
        eventBlock.attr('rx', this.booths[index].shape['rx'] * this.widthRatio);
        eventBlock.attr('ry', this.booths[index].shape['ry'] * this.heightRatio);
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
        eventBlock.attr('width', this.booths[index].shape['width'] * this.widthRatio);
        eventBlock.attr('height', this.booths[index].shape['height'] * this.heightRatio);
        eventBlock.attr('x', this.booths[index].shape['x'] * this.widthRatio);
        eventBlock.attr('y', this.booths[index].shape['y'] * this.heightRatio);
      }
    });
  }

   /**
   * Changes Beacon location in proporation to the window size
   * @param parent - HTML Element
   */
  changeBeaconBlockSize() {
    const mapArea = d3.select('.mapArea');
    const ratio = this.eventName === 'Index' ? 25 : 50;
    if (mapArea.size() ===  0) {
      return;
    }
    const beaconBlocks = mapArea.selectAll('.beaconBlock');
    this.widthRatio = Math.floor(mapArea.property('clientWidth')) / ratio;
    this.heightRatio = Math.floor(mapArea.property('clientHeight')) / ratio;

    beaconBlocks.each((d, i) => {
      const beaconBlock = d3.select(`#beaconBlock${i}`);
      const index = i;
      beaconBlock.attr('cy', this.beacons[index].y * this.heightRatio);
      beaconBlock.attr('cx', this.beacons[index].x * this.widthRatio);
    });
  }


     /**
   * Changes Beacon location in proporation to the window size
   * @param parent - HTML Element
   */
  changeRadiusBlockSize() {
    const mapArea = d3.select('.mapArea');
    const ratio = this.eventName === 'Index' ? 25 : 50;
    if (mapArea.size() ===  0) {
      return;
    }
    const radiusBlocks = mapArea.selectAll('.radiusBlock');
    this.widthRatio = Math.floor(mapArea.property('clientWidth')) / ratio;
    this.heightRatio = Math.floor(mapArea.property('clientHeight')) / ratio;

    radiusBlocks.each((d, i) => {
      const radiusBlock = d3.select(`#radiusBlock${i}`);
      const index = i;
      radiusBlock.attr('cy', this.beacons[index].y * this.heightRatio);
      radiusBlock.attr('cx', this.beacons[index].x * this.widthRatio);
    });
  }

   /**
   * Centers booth description
   * @param parent - HTML Element
   */
  changeBoothTextSize() {
    const mapArea = d3.select('.mapArea');
    if (mapArea.size() ===  0) {
      return;
    }
    const boothTexts = mapArea.selectAll('.boothText');
    const eventBlocks = mapArea.selectAll('.eventBlock');
    if (boothTexts.size() === 0 || eventBlocks.size() === 0) {
      return;
    }
    let centerEventBlockHeight = 0;
    let centerEventBlockWidth = 0;

    for (let i = 0; i < boothTexts.size(); i++ ) {
      const boothText = d3.select(`#boothText${ i }`);
      const eventBlock = d3.select(`#eventBlock${ i }`);
      if (eventBlock.attr('name') === 'circle' ) {
        centerEventBlockHeight = Number(eventBlock.attr('cy')) + Number(eventBlock.attr('r')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('cx')) + Number(eventBlock.attr('r')) / 2 ;
        boothText.attr('x', centerEventBlockWidth -  boothTexts['_groups'][0][i].getBoundingClientRect().width / 2);
        boothText.attr('y', centerEventBlockHeight);
      } else if ( eventBlock.attr('name') === 'ellipse' ) {
        centerEventBlockHeight = Number(eventBlock.attr('cy')) + Number(eventBlock.attr('ry')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('cx')) + Number(eventBlock.attr('rx')) / 2 ;
        boothText.attr('x', centerEventBlockWidth - boothTexts['_groups'][0][i].getBoundingClientRect().width);
        boothText.attr('y', centerEventBlockHeight);
      } else if ( eventBlock.attr('name') === 'polygon' ) {
        centerEventBlockHeight = eventBlocks['_groups'][0][i].getBoundingClientRect().top;
        centerEventBlockWidth = eventBlocks['_groups'][0][i].getBoundingClientRect().left +
        eventBlocks['_groups'][0][i].getBoundingClientRect().width / 2;
        boothText.attr('x', centerEventBlockWidth );
        boothText.attr('y', centerEventBlockHeight );
      } else {
        centerEventBlockHeight = Number(eventBlock.attr('y')) + Number(eventBlock.attr('height')) / 2;
        centerEventBlockWidth = Number(eventBlock.attr('x')) + Number(eventBlock.attr('width')) / 2 ;
        boothText.attr('x', centerEventBlockWidth - boothTexts['_groups'][0][i].getBoundingClientRect().width / 2 );
        boothText.attr('y', centerEventBlockHeight);
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
    this.changeBeaconBlockSize();
    this.changeBoothTextSize();
    this.changeRadiusBlockSize();
  }

}
