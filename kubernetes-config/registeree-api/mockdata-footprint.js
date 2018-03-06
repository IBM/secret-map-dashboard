/*global db:false */

const STEPS = 5;
const XRANGE = 35;
const YRANGE = 35;

let getRandomInt = (upperBound) => {
  const randomNum = Math.floor(Math.random() * Math.floor(upperBound));
  return (randomNum > 0 ? randomNum : 1);
};

let randomStep = (rows, columns) => {
  return { 
    x: getRandomInt(columns),
    y: getRandomInt(rows),
  };
};

for(let step = 1; step < STEPS; step++) {
  const footprint = randomStep(XRANGE, YRANGE);
  db.footprints.insert({"footprintId" : `f${step}`, "x" : footprint.x, "y" : footprint.y});
}

