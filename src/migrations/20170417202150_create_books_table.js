/**
 * Create books table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function up(knex) {
  return knex.schema.createTable('books', table => {
    table.increments();
    table
      .timestamp('created_at')
      .notNull()
      .defaultTo(knex.raw('now()'));
    table.timestamp('updated_at').notNull();
    table.string('title').notNull();
    table.string('author');
    table.string('isbn');
    table.string('year');
  });
}

/**
 * Drop books table.
 *
 * @param  {object} knex
 * @return {Promise}
 */
export function down(knex) {
  return knex.schema.dropTable('books');
}
