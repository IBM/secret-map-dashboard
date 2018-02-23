process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

const Registeree = require('../models/registeree');

chai.use(chaiHttp);
//Our parent block
describe('Registerees', () => {
  beforeEach((done) => { //Before each test we empty the database
    done();
  });
  /*
  * Test the /GET route
  */
  describe('GET /registerees', () => {
    it('it should GET all the registerees', (done) => {
      done();
    });
  });

  describe('GET /registerees/info/:registereeId', () => {
    it('it should GET info for registeree', (done) => {
      done();
    });
  });

  describe('GET /registerees/totalSteps', () => {
    it('it should GET all the steps walked by registerees', (done) => {
      done();
    });
  });

  describe('GET /registerees/totalCalories', () => {
    it('it should GET all the calories by registerees', (done) => {
      done();
    });
  });
  /*
  * Test the /POST route
  */
  describe('POST /registerees/add', () => {
    it('it should POST a registeree', (done) => {
      done();
    });
  });
});