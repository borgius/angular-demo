import { Router } from 'express';
import HttpStatus from 'http-status-codes';
import * as bookService from '../services/bookService';
import { findBook, bookValidator } from '../validators/bookValidator';

const router = Router();

/**
 * GET /api/books
 */
router.get('/', (req, res, next) => {
  bookService
    .getAllBooks()
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * GET /api/books/:id
 */
router.get('/:id', (req, res, next) => {
  bookService
    .getBook(req.params.id)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * POST /api/books
 */
router.post('/', bookValidator, (req, res, next) => {
  bookService
    .createBook(req.body)
    .then(data => res.status(HttpStatus.CREATED).json({ data }))
    .catch(err => next(err));
});

/**
 * PUT /api/books/:id
 */
router.put('/:id', findBook, bookValidator, (req, res, next) => {
  bookService
    .updateBook(req.params.id, req.body)
    .then(data => res.json({ data }))
    .catch(err => next(err));
});

/**
 * DELETE /api/books/:id
 */
router.delete('/:id', findBook, (req, res, next) => {
  bookService
    .deleteBook(req.params.id)
    .then(data => res.status(HttpStatus.NO_CONTENT).json({ data }))
    .catch(err => next(err));
});

export default router;
