import bookshelf from '../db';
import { SCHEMA } from '../validators/bookValidator';

const TABLE_NAME = 'books';

/**
 * Book model.
 */
class Book extends bookshelf.Model {
  get tableName() {
    return TABLE_NAME;
  }

  get hasTimestamps() {
    return true;
  }

  static filterParams(data) {
    return Object.entries(SCHEMA).reduce((a, [k]) => ((a[k] = data[k]), a), {});
  }

  static byTitle(title) {
    return this.forge()
      .query({ where: { title } })
      .fetch();
  }
}

export default Book;
