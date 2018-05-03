/**
 * Seed books table.
 *
 * @param  {object} knex
 * @param  {object} Promise
 * @return {Promise}
 */
export function seed(knex, Promise) {
  // Deletes all existing entries
  return knex('books')
    .del()
    .then(() => {
      return Promise.all([
        // Inserts seed entries
        knex('books').insert([
          {
            updated_at: new Date(),
            title: 'Switching to Angular',
            isbn: '978-1-78862-070-3',
            author: 'Minko Gechev',
            year: '2017'
          }
        ])
      ]);
    });
}
