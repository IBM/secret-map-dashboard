process.env.UNIT_TEST = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
// const server = require('../app');
// const should = chai.should();
// const Footprint = require('../models/registeree');

chai.use(chaiHttp);
//Our parent block
describe('Footprints', () => {
  beforeEach((done) => { //Before each test we empty the database
    done();
  });
  /*
  * Test the /GET route
  */
  describe('GET /footprints', () => {
    it('it should GET all the footprints', (done) => {
      done();
    });
  });
  /*
  * Test the /POST route
  */
  describe('POST /footprints/add', () => {
    it('it should POST add a footprint', (done) => {
      done();
    });
  });

  describe('POST /footprints/remove/:footprintId', () => {
    it('it should POST remove a print', (done) => {
      done();
    });
  });

});