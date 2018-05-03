import Boom from 'boom';
import Book from '../models/book';
import logger from '../utils/logger';

/**
 * Get all books.
 *
 * @return {Promise}
 */
export function getAllBooks() {
  return Book.fetchAll();
}

/**
 * Get a book.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getBook(id) {
  return new Book({ id }).fetch().then(book => {
    if (!book) {
      throw new Boom.notFound('Book not found');
    }

    return book;
  });
}

/**
 * Create new book.
 *
 * @param  {Object}  book
 * @return {Promise}
 */
export function createBook(book) {
  return new Book(Book.filterParams(book)).save().then(book => book.refresh());
}

/**
 * Update a book.
 *
 * @param  {Number|String}  id
 * @param  {Object}         book
 * @return {Promise}
 */
export function updateBook(id, book) {
  return new Book({ id })
    .save(Book.filterParams(book))
    .then(book => book.refresh())
    .catch(err => logger.error(err));
}

/**
 * Delete a book.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteBook(id) {
  return new Book({ id }).fetch().then(book => book.destroy());
}
