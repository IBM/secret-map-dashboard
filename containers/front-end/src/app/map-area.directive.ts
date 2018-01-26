import { Directive, Input, ElementRef, AfterViewChecked, HostListener, OnInit} from '@angular/core';
import { Booth, Beacon} from './conferenceItems';
import { forEach } from '@angular/router/src/utils/collection';
import { interceptingHandler } from '@angular/common/http/src/module';
@Directive({
  selector: '[appMapArea]'
})
export class MapAreaDirective implements AfterViewChecked {

  @Input() booths: Booth[];
  @Input() beacons: Beacon[];
  heightRatio: number;
  widthRatio: number;

  constructor(private el: ElementRef) {
  }

  ngAfterViewChecked() {
    this.changeEventBlockSize(this.el.nativeElement);
    this.changeBeaconBlockSize(this.el.nativeElement);
    this.changeBoothTextSize(this.el.nativeElement);
  }

  // Changes booth blocks in proporation to the window size
  changeEventBlockSize(parent: HTMLElement) {
    if (!parent) {
      return;
    }

    const children = parent.getElementsByClassName('eventBlock');

    if (children.length === 0) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 50; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 50; //  25 is the width dimenstion  reference in mongodb

    let counter  = 0;

    const eventBlocks = Array.from(children).map(eventBlock => eventBlock.attributes);

    Array.from(eventBlocks)
    .map(eventBlock => {
      if (eventBlock.getNamedItem('name').value === 'circle') {
        eventBlock.setNamedItem(this.updateAttributes('cx', this.booths[counter].shape['cx'] * this.widthRatio));
        eventBlock.setNamedItem(this.updateAttributes('cy', this.booths[counter].shape['cy'] * this.heightRatio));
        eventBlock.setNamedItem(this.updateAttributes('r', this.booths[counter].shape['radius']
          * ( (this.widthRatio + this.heightRatio) / 4)));
      } else if (eventBlock.getNamedItem('name').value === 'ellipse') {
        eventBlock.setNamedItem(this.updateAttributes('cx', this.booths[counter].shape['cx'] * this.widthRatio));
        eventBlock.setNamedItem(this.updateAttributes('cy', this.booths[counter].shape['cy'] * this.heightRatio));
        eventBlock.setNamedItem(this.updateAttributes('rx', this.booths[counter].shape['rx'] * this.widthRatio));
        eventBlock.setNamedItem(this.updateAttributes('ry', this.booths[counter].shape['ry'] * this.heightRatio));
      } else if (eventBlock.getNamedItem('name').value === 'polygon') {
        const integers = this.booths[counter].shape['points'].split(/[\s,]+/);
        let scaledPoints = '';
        let i;
        for (i in integers) {
          if ( i % 2 === 0) {
            scaledPoints += integers[i] * this.widthRatio + ',';
          } else {
            scaledPoints += integers[i] * this.heightRatio + ' ';
          }
        }
        eventBlock.setNamedItem(this.updateAttributes('points', scaledPoints));
      } else {
        eventBlock.setNamedItem(this.updateAttributes('width', this.booths[counter].shape['width'] * this.widthRatio));
        eventBlock.setNamedItem(this.updateAttributes('height', this.booths[counter].shape['height'] * this.heightRatio));
        eventBlock.setNamedItem(this.updateAttributes('x', this.booths[counter].shape['x'] * this.widthRatio));
        eventBlock.setNamedItem(this.updateAttributes('y', this.booths[counter].shape['y'] * this.heightRatio));
      }
      counter += 1;
    });
  }

  // Changes Beacon location in proporation to the window size
  changeBeaconBlockSize(parent: HTMLElement) {
    if (!parent) {
      return;
    }

    const children = parent.getElementsByClassName('beaconBlock');

    if (children.length === 0) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 25; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 25; //  25 is the width dimenstion  reference in mongodb

    let counter = 0;

    const beaconsBlocks = Array.from(children).map(beaconBlock => beaconBlock.attributes);

    Array.from(beaconsBlocks)
    .map(beaconsBlock => {
      beaconsBlock.setNamedItem(this.updateAttributes('cy', this.beacons[counter].y * this.heightRatio));
      beaconsBlock.setNamedItem(this.updateAttributes('cx', this.beacons[counter].x * this.widthRatio));
      counter += 1;
    });
  }

  // Centers booth description
  changeBoothTextSize(parent: HTMLElement) {
    if (!parent) {
      return;
    }

    const boothTexts = parent.getElementsByClassName('boothText');
    const eventBlocks = parent.getElementsByClassName('eventBlock');

    if (boothTexts.length === 0 || eventBlocks.length === 0) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 50; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 50; //  25 is the width dimenstion  reference in mongodb

    let counter  = 0;
    let centerEventBlockHeight = 0;
    let centerEventBlockWidth = 0;

    Array.from(boothTexts)
    .map(boothText => {
      if ( eventBlocks[counter].attributes.getNamedItem('name').value === 'circle' ) {
        centerEventBlockHeight = Number(eventBlocks[counter].attributes.getNamedItem('cy').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('r').value) / 2;
        centerEventBlockWidth = Number(eventBlocks[counter].attributes.getNamedItem('cx').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('r').value) / 2 ;
        boothText.attributes.setNamedItem(this.updateAttributes('x', centerEventBlockWidth - boothText.getBoundingClientRect().width / 2 ));
        boothText.attributes.setNamedItem(this.updateAttributes('y', centerEventBlockHeight));
      } else if ( eventBlocks[counter].attributes.getNamedItem('name').value === 'ellipse' ) {
        centerEventBlockHeight = Number(eventBlocks[counter].attributes.getNamedItem('cy').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('ry').value) / 2;
        centerEventBlockWidth = Number(eventBlocks[counter].attributes.getNamedItem('cx').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('rx').value) / 2 ;
        boothText.attributes.setNamedItem(this.updateAttributes('x', centerEventBlockWidth - boothText.getBoundingClientRect().width ));
        boothText.attributes.setNamedItem(this.updateAttributes('y', centerEventBlockHeight));
      } else if ( eventBlocks[counter].attributes.getNamedItem('name').value === 'polygon' ) {
        centerEventBlockHeight = eventBlocks[counter].getBoundingClientRect().top ;
        centerEventBlockWidth = eventBlocks[counter].getBoundingClientRect().left + eventBlocks[counter].getBoundingClientRect().width / 2;
        boothText.attributes.setNamedItem(this.updateAttributes('x', centerEventBlockWidth ));
        boothText.attributes.setNamedItem(this.updateAttributes('y', centerEventBlockHeight ));
      } else {
        centerEventBlockHeight = Number(eventBlocks[counter].attributes.getNamedItem('y').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('height').value) / 2;
        centerEventBlockWidth = Number(eventBlocks[counter].attributes.getNamedItem('x').value) +
          Number(eventBlocks[counter].attributes.getNamedItem('width').value) / 2 ;
        boothText.attributes.setNamedItem(this.updateAttributes('x', centerEventBlockWidth - boothText.getBoundingClientRect().width / 2 ));
        boothText.attributes.setNamedItem(this.updateAttributes('y', centerEventBlockHeight));
      }
      counter += 1;
    });
  }

  // Looking for when the browser changes in size
  @HostListener('window:resize')
  onResize() {
    this.changeEventBlockSize(this.el.nativeElement);
    this.changeBeaconBlockSize(this.el.nativeElement);
    this.changeBoothTextSize(this.el.nativeElement);
  }

  updateAttributes(attributeName: string, attributeValue: any ): Attr {
    const attr = document.createAttribute(attributeName);
    attr.value = String(attributeValue);
    return attr;
  }

}
