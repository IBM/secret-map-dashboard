/*global db:false */

const NUM_REGISTEREES = 5;
const MAX_CALORIES = 1000;
const MAX_STEPS = 10000;

let getRandomInt = (upperBound) => {
  const randomNum = Math.floor(Math.random() * Math.floor(upperBound));
  return (randomNum > 0 ? randomNum : 1);
};

for(let registeree = 0; registeree < NUM_REGISTEREES; registeree++) {
  const calories = getRandomInt(MAX_CALORIES);
  const steps = getRandomInt(MAX_STEPS);
  db.registerees.insert({ "registereeId" : `R${registeree}`, "calories" : calories, "steps" : steps});
}

