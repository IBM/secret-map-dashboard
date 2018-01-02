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
  }

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

    const rectTags = Array.from(children)
    .map(rectTag => rectTag.attributes);

    Array.from(rectTags)
    .map(rectTag => {
      rectTag.setNamedItem(this.updateAttributes('width', this.booths[counter].xDimension * this.widthRatio));
      rectTag.setNamedItem(this.updateAttributes('height', this.booths[counter].yDimension * this.heightRatio));
      rectTag.setNamedItem(this.updateAttributes('x', this.booths[counter].x * this.widthRatio));
      rectTag.setNamedItem(this.updateAttributes('y', this.booths[counter].y * this.heightRatio));
      counter += 1;
    });
  }

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

    const circleTags = Array.from(children)
    .map(circleTag => circleTag.attributes);

    Array.from(circleTags)
    .map(circleTag => {
      circleTag.setNamedItem(this.updateAttributes('r', 5));
      circleTag.setNamedItem(this.updateAttributes('cy', this.booths[counter].y * this.heightRatio));
      circleTag.setNamedItem(this.updateAttributes('cx', this.booths[counter].x * this.widthRatio));
      counter += 1;
    });
  }

  // Looking for when the browser changes in size
  @HostListener('window:resize')
  onResize() {
    this.changeEventBlockSize(this.el.nativeElement);
    this.changeBeaconBlockSize(this.el.nativeElement);
  }

  updateAttributes(attributeName: string, attributeValue: number ): Attr {
    const attr = document.createAttribute(attributeName);
    attr.value = String(attributeValue);
    return attr;
  }
}
