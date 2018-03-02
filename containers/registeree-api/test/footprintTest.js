process.env.UNIT_TEST = "test";

/*global should:false*/
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const Footprint = require('../models/footprint');

chai.use(chaiHttp);
//Our parent block
describe('Footprints', () => {
  beforeEach((done) => { //Before each test we empty the database
    Footprint.remove({}, (err) => {
      if (err) {
        done();
        throw err;
      } else {
        done();
      }

    });
  });
  /*
  * Test the /GET route
  */
  describe('GET /footprints', () => {
    it('it should GET all the footprints', (done) => {
      chai.request(server)
        .get('/footprints')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('GET /footprints/:footprintId', () => {
    it('it should a get desired footprint', (done) => {
      let addFootprint = new Footprint({
        footprintId: "F1",
        x: 1,
        y: 1
      });
      addFootprint.save((err) => {
        if (err) {
          done();
          throw err;
        } 
        chai.request(server)
          .get('/footprints/F1')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('footprintId');
            res.body.should.have.property('footprintId').eql('F1');
            res.body.should.have.property('x');
            res.body.should.have.property('y');
            done();
          });
      });
    });
  });

  /*
  * Test the /POST route
  */
  describe('POST /footprints/add', () => {
    it('it should POST add a footprint', (done) => {
      let footprint = {
        footprintId: "F1",
        x: 1,
        y: 1
      };
      chai.request(server)
        .post('/footprints/add')
        .send(footprint)
        .end((err, res) => {
          res.should.have.status(200);
          res.text.should.be.a('String');
          res.text.should.be.eql('Saved footprint.');
          done();
        });
    });
  });

  describe('POST /footprints/remove/:footprintId', () => {
    it('it should POST remove a print', (done) => {
      let addFootprint = new Footprint({
        footprintId: "F1",
        x: 1,
        y: 1
      });
      addFootprint.save((err) =>{
        if (err) {
          done();
          throw err;
        } 
        chai.request(server)
          .post(`/footprints/remove/F1`)
          .end((err, res) => {
            res.should.have.status(200);
            res.text.should.be.a('String');
            res.text.should.be.eql('Delete footprint.');
            done();
          });
      });
    });
  });
});