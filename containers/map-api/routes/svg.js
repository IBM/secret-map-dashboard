const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const SVGtoPDF = require("svg-to-pdfkit");
const stream = require("stream");

const Events = require("../models/event");


router.get("/:eventId", function(req, res) {
  Events.findOne(req.params, function(err, event) {
    if (err) {
      res.send("Error getting event: " + err);
      return console.error(err);
    } else if (event) {
      // Get SVG Content
      let SVGContent = svgContent(event.map,10);

      // Send SVG
      res.send(svgTemplate(100,100,SVGContent,10));
    } else {
      res.send("Event not found...");
    }
  });
});

router.get("/:eventId/pdf", function(req, res) {
  Events.findOne(req.params, function(err, event) {
    if (err) {
      res.send("Error getting event: " + err);
      return console.error(err);
    } else if (event) {
      // Get SVG with a scale of 10
      let SVGContent = svgContent(event.map,10);
      let svg = svgTemplate(100,100,SVGContent,10); // Fixed to 100 for now.

      // Start making PDF
      let doc = new PDFDocument({ size: [400,400]}); // Fixed to 400 for now.
      let echoStream = new stream.Writable();
      let pdfBuffer = new Buffer("");

      // Write to Buffer
      echoStream._write = function (chunk, encoding, done) {
        pdfBuffer = Buffer.concat([pdfBuffer, chunk]);
        done();
      };

      // Use svg-to-pdfkit
      SVGtoPDF(doc, svg, 0, 0);
      doc.pipe(echoStream);
      doc.end();

      // Set content type to pdf
      res.contentType("application/pdf");

      // When stream is done, send pdf
      echoStream.on("finish", function () {
        // Make Buffer readable stream
        let bufferStream = new stream.PassThrough();
        bufferStream.end(pdfBuffer);
        bufferStream.pipe(res);
      });
    } else {
      res.send("Event not found...");
    }
  });
});

/**
 * Forms an SVG
 * @param {String} width is the width of SVG.
 * @param {String} height is the height of SVG.
 * @param {String} content contains the SVG elements.
 * @param {String} scale is used to scale the values: [width, height]
 * @return {String} an SVG in xml format
 */
function svgTemplate(width, height, content, scale) {
  let svg = "<svg width='" + width*scale + "' height='" + height*scale + "'>" +
    content + "</svg>";
  return svg;
}

function svgContent(arrayOfElements,scale) {
  let svg = "";
  for (let i = 0; i < arrayOfElements.length; i++) {
    let booth = arrayOfElements[i];
    let elem = booth.shape;
    if(elem.type == "rectangle") {
      svg +=
        rectangleTemplate(elem.x, elem.y, elem.width, elem.height,scale);
    }
    if(elem.type == "circle") {
      svg +=
        circleTemplate(elem.cx, elem.cy, elem.radius,scale);
    }
    if(elem.type == "ellipse") {
      svg +=
        ellipseTemplate(elem.cx, elem.cy, elem.rx, elem.ry,scale);
    }
    if(elem.type == "polygon") {
      svg +=
        polygonTemplate(elem.points,scale);
    }
  }
  return svg;
}

/**
 * Forms an SVG element of rectangle
 * @param {String} x is the x location of the rectangle.
 * @param {String} y is the y location of the rectangle.
 * @param {String} width is the width of the rectangle.
 * @param {String} height is the height of the rectangle.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function rectangleTemplate(x, y, width, height, scale) {
  let svg = "<rect x='" + x*scale + "' y='" + y*scale + "' width='" +
    width*scale + "' height='" + height*scale + "' />";
  return svg;
}

/**
 * Forms an SVG element of circle
 * @param {String} cx is the x location of the center of the circle.
 * @param {String} cy is the y location of the center of the circle.
 * @param {String} radius is the radius of the circle.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of circle in xml format
 */
function circleTemplate(cx, cy, radius, scale) {
  let svg = "<circle cx='" + cx*scale + "' cy='" + cy*scale + "' r='" +
    radius*scale + "' />";
  return svg;
}

/**
 * Forms an SVG element of ellipse
 * @param {String} cx is the x location of the center of the ellipse.
 * @param {String} cy is the y location of the center of the ellipse.
 * @param {String} rx is the x radius of the ellipse.
 * @param {String} ry is the y radius of the ellipse.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function ellipseTemplate(cx, cy, rx, ry, scale) {
  let svg = "<ellipse cx='" + cx*scale + "' cy='" + cy*scale + "' rx='" +
    rx*scale + "' ry='" + ry*scale + "' />";
  return svg;
}

/**
 * Forms an SVG element of polygon
 * @param {String} points contains the points of the polygon.
 * @param {String} scale is used to scale the values above.
 * @return {String} an SVG element of rectangle in xml format
 */
function polygonTemplate(points, scale) {
  let integers = points.split(/[\s,]+/);
  let scaledInt = "";
  for (let i in integers) {
    if (i % 2 == 0) {
      scaledInt += integers[i]*scale + ",";
    }
    else {
      scaledInt += integers[i]*scale + " ";
    }
  }
  points = scaledInt;
  let svg = "<polygon points='" + points + "' />";
  return svg;
}

module.exports = router;
