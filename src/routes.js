import { Router } from 'express';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import logger from './utils/logger';
import swaggerSpec from './utils/swagger';
import booksController from './controllers/books';

/**
 * Contains all API routes for the application.
 */
let router = Router();

/**
 * GET /api/swagger.json
 */
router.get('/swagger.json', (req, res) => {
  res.json(swaggerSpec);
});

/**
 * @swagger
 * definitions:
 *   App:
 *     title: App
 *     type: object
 *     properties:
 *       app:
 *         type: string
 *       apiVersion:
 *         type: string
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API version
 *     description: App version
 *     produces:
 *       - application/json
 *     tags:
 *       - Base
 *     responses:
 *       200:
 *         description: Application and API version
 *         schema:
 *           title: books
 *           type: object
 *           $ref: '#/definitions/App'
 */
router.get('/', (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version
  });
});

router.use(
  expressJwt({ secret: process.env.JWT_SECRET }).unless({
    path: ['/api', '/api/swagger.json', '/api/login']
  })
);

router.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ message: err.message });
    logger.error(err);

    return;
  }
  next();
});

router.post('/login', function(req, res) {
  /*
   * Check if the username and password is correct
   */
  logger.info(req.body);
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    res.json({
      id: 1,
      username: 'admin',
      jwt: jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    });
  } else {
    /*
     * If the username or password was wrong, return 401 ( Unauthorized )
     * status code and JSON error message
     */
    res.status(401).json({
      error: {
        message: 'Wrong username or password!'
      }
    });
  }
});

router.use('/books', booksController);

export default router;
