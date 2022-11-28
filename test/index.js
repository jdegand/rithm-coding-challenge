// have to run the server first - 'npm start'
// open another terminal and run 'npm run test'

const request = require('request');
const cheerio = require('cheerio');
const expect = require('chai').expect;
baseUrl = 'http://localhost:3000';

describe('Rithm Coding Challenge', function () {

  it('Users route displays leaflet view', function (done) {
      request(baseUrl + "/users", function (error, response, body) {
          expect(error).to.be.not.ok;
          expect(response.statusCode).to.be.equal(200);
        
          const $ = cheerio.load(body);
          const link = $('a').html();

          expect(link.toString()).contains('Home');

          done();
      });
  });

  it('Radius is passed', function (done) {
    request(baseUrl + "/users?dist=1000", function (error, response, body) {
        expect(error).to.be.not.ok;
        expect(response.statusCode).to.be.equal(200);
        expect(body.includes('let rad = 1000')).to.be.true;
        done();
    });
  });

  it('Origin', function (done) {
    request(baseUrl + "/users?origin=-122.419416%2C37.774929", function (error, response, body) {
        // expected answer is Taylor Swift
        expect(error).to.be.not.ok;
        expect(response.statusCode).to.be.equal(200);
        expect(body.includes('let namesArr = \'Taylor Swift\'')).to.be.true;
        done();
    });
  });

  it('Multiple Params', function (done) {
    request(baseUrl + "/users?fav_color=green&dist=1000&min_age=46&max_age=46", function (error, response, body) {
        // expected answer is Chris Martin
        expect(error).to.be.not.ok;
        expect(response.statusCode).to.be.equal(200);
        expect(body.includes('let namesArr = \'Chris Martin\'')).to.be.true;
        done();
    });
  });

  it('No Results', function (done) {
    request(baseUrl + "/users?fav_color=brown", function (error, response, body) {
        expect(error).to.be.not.ok;
        expect(response.statusCode).to.be.equal(200);
      
        const $ = cheerio.load(body);
        const noResults = $('#none').text();

        expect(noResults.includes('No Results')).to.be.true;

        done();
    });
  });

});

/*
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const app = require('../app');
//const should = chai.should();
const {expect} = require('chai')

chai.use(chaiHttp);

describe('rithm coding challenge', function () {

    it('Should have home page', (done) => {
        // Describe what should happen
        // In this case we test that the home page loads
        chai.request(app)
          .get('/users')
          .query({fav_color: 'green'})
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            res.should.have.status(200);
            return done(); // Call done if the test completed successfully.
          });
          
    });
});
*/

/*
  it('Should have home page', function (done) {
    // Describe what should happen
    // In this case we test that the home page loads
    chai.request(app)
      .get('/')
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        res.should.have.status(200);
        return done(); // Call done if the test completed successfully.
      });
  });
*/

/*
const assert = require('assert');
const expect = require('chai').expect
const request = require('supertest');
const app = require('../app')

describe('Unit testing the /home route', function() {

    it('should return OK status', async function() {
      const response = await request(app)
        .get('/');
      assert.equal(response.status, 200);
    });

    it('should return message on rendering', async function() {
      const response = await request(app)
        .get('/users');
      assert.equal(response.status, 200);
    });

});
*/
