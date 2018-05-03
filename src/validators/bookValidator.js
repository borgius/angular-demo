import Joi from 'joi';
import validate from '../utils/validate';
import * as bookService from '../services/bookService';

const SCHEMA = {
  id: Joi.number(),
  title: Joi.string()
    .label('Title')
    .max(90)
    .required(),
  author: Joi.string()
    .label('Author')
    .min(3)
    .max(30)
    .required(),
  isbn: Joi.alternatives(
    Joi.string().regex(
      /^(?:ISBN(?:-10)?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$)[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
    ),
    Joi.string().regex(
      /^(?:ISBN(?:-13)?:? )?(?=[0-9]{13}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]$/
    )
  ).error(() => {
    return {
      message: 'Should be correct ISBN format (https://en.wikipedia.org/wiki/International_Standard_Book_Number)'
    };
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
};

/**
 * Validate create/update book request.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function bookValidator(req, res, next) {
  return validate(req.body, SCHEMA)
    .then(() => next())
    .catch(err => next(err));
}

/**
 * Validate books existence.
 *
 * @param  {object}   req
 * @param  {object}   res
 * @param  {function} next
 * @return {Promise}
 */
function findBook(req, res, next) {
  return bookService
    .getBook(req.params.id)
    .then(() => next())
    .catch(err => next(err));
}

export { SCHEMA, findBook, bookValidator };
