import { Directive, Input, ElementRef, AfterViewChecked, HostListener, OnInit} from '@angular/core';
import { Booth, Beacon} from './conferenceItems';
@Directive({
  selector: '[appMapArea]'
})
export class MapAreaDirective implements AfterViewChecked {

  @Input() booths: Booth[];
  @Input() beacons: Beacon[];
  heightRatio: number;
  widthRatio: number;

  constructor(private el: ElementRef) { }

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

    if (!children) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 25; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 25; //  25 is the width dimenstion  reference in mongodb

    let counter  = 0;

    const rectTags = Array.from(children).map(rectTag => rectTag.attributes);

    Array.from(rectTags)
    .map(rectTag => {
      rectTag.setNamedItem(this.updateAttributes('width', this.booths[counter].shape['width'] * this.widthRatio));
      rectTag.setNamedItem(this.updateAttributes('height', this.booths[counter].shape['height'] * this.heightRatio));
      rectTag.setNamedItem(this.updateAttributes('x', this.booths[counter].shape['x'] * this.widthRatio));
      rectTag.setNamedItem(this.updateAttributes('y', this.booths[counter].shape['y'] * this.heightRatio));
      counter += 1;
    });
  }

  // Changes Beacon location in proporation to the window size
  changeBeaconBlockSize(parent: HTMLElement) {
    if (!parent) {
      return;
    }

    const children = parent.getElementsByClassName('beaconBlock');

    if (!children) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 25; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 25; //  25 is the width dimenstion  reference in mongodb
    let counter = 0;

    const circleTags = Array.from(children).map(circleTag => circleTag.attributes);

    Array.from(circleTags)
    .map(circleTag => {
      circleTag.setNamedItem(this.updateAttributes('cy', this.beacons[counter].y * this.heightRatio));
      circleTag.setNamedItem(this.updateAttributes('cx', this.beacons[counter].x * this.widthRatio));
      counter += 1;
    });
  }

  // Centers booth description
  changeBoothTextSize(parent: HTMLElement) {

    if (!parent) {
      return;
    }

    const boothTexts = parent.getElementsByClassName('boothText');
    const rectTags = parent.getElementsByClassName('eventBlock');

    if (!boothTexts || !rectTags) {
      return;
    }

    this.heightRatio = parent.getBoundingClientRect().height / 25; // 25 is the height dimension reference in mongodb
    this.widthRatio =  parent.getBoundingClientRect().width / 25; //  25 is the width dimenstion  reference in mongodb

    let counter  = 0;

    let centerRectTagHeight = 0;
    let centerRectTagWidth = 0;

    Array.from(boothTexts)
    .map(boothText => {

      centerRectTagHeight = Number(rectTags[counter].attributes.getNamedItem('y').value) +
        Number(rectTags[counter].attributes.getNamedItem('height').value) / 2;
      centerRectTagWidth = Number(rectTags[counter].attributes.getNamedItem('x').value) +
        Number(rectTags[counter].attributes.getNamedItem('width').value) / 2 ;
      boothText.attributes.setNamedItem(this.updateAttributes('x', centerRectTagWidth - boothText.getBoundingClientRect().width / 2 ));
      boothText.attributes.setNamedItem(this.updateAttributes('y', centerRectTagHeight));

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

  updateAttributes(attributeName: string, attributeValue: number ): Attr {
    const attr = document.createAttribute(attributeName);
    attr.value = String(attributeValue);
    return attr;
  }
}
