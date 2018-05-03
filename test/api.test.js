import { expect } from 'chai';
import app from '../src/index';
import request from 'supertest';

describe('Base API Test', () => {
  let jwt = '';
  before(done => {
    request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'admin' })
      .end((err, res) => {
        jwt = 'Bearer ' + res.body.jwt;
        done();
      });
  });

  it('should return API version and title for the app', done => {
    request(app)
      .get('/api')
      .set('Authorization', jwt)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.app).to.be.equal(app.locals.title);
        expect(res.body.apiVersion).to.be.equal(app.locals.version);

        done();
      });
  });

  it('should return 405 method not allowed for random API hits', done => {
    let randomString = Math.random()
      .toString(36)
      .substr(2, 5);

    request(app)
      .get(`/api/${randomString}`)
      .set('Authorization', jwt)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(405);
        done();
      });
  });
});
