import { expect } from 'chai';
import request from 'supertest';
import app from '../../src/index';
import bookshelf from '../../src/db';

/**
 * Tests for '/api/books'
 */
describe('Books Controller Test', () => {
  let jwt = '';
  before(done => {
    bookshelf
      .knex('books')
      .truncate()
      .then(() => {
        request(app)
          .post('/api/login')
          .send({ username: 'admin', password: 'admin' })
          .end((err, res) => {
            jwt = 'Bearer ' + res.body.jwt;
            done();
          });
      });
  });

  it('should return list of books', done => {
    request(app)
      .get('/api/books')
      .set('Authorization', jwt)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(0);

        done();
      });
  });

  it('should not create a new book if author is not provided', done => {
    let book = {
      title: 'Jane Doe'
    };

    request(app)
      .post('/api/books')
      .set('Authorization', jwt)
      .send(book)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(422);
        expect(code).to.be.equal(422);
        expect(message).to.be.equal('Unprocessable Entity');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'author');

        done();
      });
  });

  it('should create a new book with valid data', done => {
    let book = {
      title: 'Switching to Angular 5',
      isbn: '978-1-78862-070-3',
      author: 'Minko Gechev',
      year: '2017'
    };

    request(app)
      .post('/api/books')
      .set('Authorization', jwt)
      .send(book)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(201);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('title');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');
        expect(data.title).to.be.equal(book.title);

        done();
      });
  });

  it('should get information of book', done => {
    request(app)
      .get('/api/books/1')
      .set('Authorization', jwt)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('title');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');

        done();
      });
  });

  it('should respond with not found error if random book id is provided', done => {
    request(app)
      .get('/api/books/1991')
      .set('Authorization', jwt)
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('Book not found');

        done();
      });
  });

  it('should update a book if title is provided', done => {
    let book = {
      id: 1,
      title: 'Switching to Angular 6',
      isbn: '978-1-78862-070-3',
      author: 'Minko Gechev',
      year: '2017'
    };

    request(app)
      .put('/api/books/1')
      .set('Authorization', jwt)
      .send(book)
      .end((err, res) => {
        let { data } = res.body;

        expect(res.statusCode).to.be.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.property('id');
        expect(data).to.have.property('title');
        expect(data).to.have.property('createdAt');
        expect(data).to.have.property('updatedAt');
        expect(data.title).to.be.equal(book.title);

        done();
      });
  });

  it('should not update a book if title is not provided', done => {
    let book = {
      id: 1,
      isbn: '978-1-78862-070-3',
      author: 'Minko Gechev',
      year: '2017'
    };

    request(app)
      .put('/api/books/1')
      .send(book)
      .set('Authorization', jwt)
      .end((err, res) => {
        let { code, message, details } = res.body.error;

        expect(res.statusCode).to.be.equal(422);
        expect(code).to.be.equal(422);
        expect(message).to.be.equal('Unprocessable Entity');
        expect(details).to.be.an('array');
        expect(details[0]).to.have.property('message');
        expect(details[0]).to.have.property('param', 'title');

        done();
      });
  });

  it('should delete a book if valid id is provided', done => {
    request(app)
      .delete('/api/books/1')
      .set('Authorization', jwt)
      .end((err, res) => {
        expect(res.statusCode).to.be.equal(204);

        done();
      });
  });

  it('should respond with not found error if random book id is provided for deletion', done => {
    request(app)
      .delete('/api/books/1991')
      .set('Authorization', jwt)
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(404);
        expect(code).to.be.equal(404);
        expect(message).to.be.equal('Book not found');

        done();
      });
  });

  it('should respond with bad request for empty JSON in request body', done => {
    let book = {};

    request(app)
      .post('/api/books')
      .send(book)
      .end((err, res) => {
        let { code, message } = res.body.error;

        expect(res.statusCode).to.be.equal(400);
        expect(code).to.be.equal(400);
        expect(message).to.be.equal('Empty JSON');

        done();
      });
  });
});
