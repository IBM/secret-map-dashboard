import { Component, OnInit, ElementRef} from '@angular/core';
import * as d3 from 'd3';
import * as d3Hexbin from 'd3-hexbin';
import { Attribute } from '@angular/compiler';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.random();
  }

  random() {
    const width = d3.select('.heatmap').property('clientWidth');
    const height =  d3.select('.heatmap').property('clientHeight');

    const margin = {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15
    };

    // The number of columns and rows of the heatmap
    const MapColumns = 49;
    const MapRows = 30;

    // The maximum radius the hexagons can have to still fit the screen
    const hexRadius = d3.min( [width / ((MapColumns + 0.5) * Math.sqrt(3)),
      height / ((MapRows + 1 / 3) * 1.5)]);

    const points = [];
    for (let i = 0; i < MapRows; i++) {
        for (let j = 0; j < MapColumns; j++) {
            points.push([hexRadius * j * 1.75, hexRadius * i * 1.5]);
        }// for j
    }// for i

    const svg = d3.select('.heatmap')
    .attr('width', width )
    .attr('height', height )
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const d3_hexbin = d3Hexbin.hexbin;

    const hexbin = d3_hexbin().radius(hexRadius);

    // //Draw the hexagons
  //   svg.append('g')
  //   .selectAll('.hexagon')
  //   .data(hexbin(points))
  //   .enter().append('path')
  //   .attr('class', 'hexagon')
  //   .attr('d', (d) => {
  //   return 'M' + d.x + ',' + d.y + hexbin.hexagon();
  //   })
  //   .attr('stroke', 'white')
  //   .attr('stroke-width', '1px')
  //   .style('fill', '#CCCCCC');
  }
}
