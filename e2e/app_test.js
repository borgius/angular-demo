const { expect, assert } = require('chai').use(require('chai-as-promised'));
const faker = require('faker');

Feature('Books');

Scenario('I Can login and logout', async I => {
  I.login();
  I.waitInUrl('/books', 2);
  I.see('LogOut');
  I.click('LogOut');
  I.waitInUrl('/login', 2);
});

Scenario("I can't see books without authorization", async I => {
  I.amOnPage('/books');
  I.waitInUrl('/login', 2);
  I.amOnPage('/books/1');
  I.waitInUrl('/login', 2);
  I.see('Book is not found');
});

Scenario('I can add new book', async I => {
  I.login();
  I.amOnPage('/books');
  I.click('Add');
  I.click('Save');
  I.see('Backend: "Title" is not allowed to be empty');
  I.see('Backend: "Author" length must be at least 3 characters long');
  I.see('Backend: Should be correct ISBN format');
  I.see('Backend: "year" must be a number');
  I.fillField('Title', 'test');
  I.fillField('Author', 'test');
  I.fillField('ISBN', '978-1-78862-070-4');
  I.fillField('Year', '2018');
  I.click('Save');
  I.see('978-1-78862-070-4', '.mat-row');
});

Scenario('I can see and edit books', async I => {
  I.login();
  I.amOnPage('/books');
  I.seeNumberOfElements('.mat-row', 2);
  I.see('Switching to Angular');
  I.seeNumberOfElements('mat-icon', 4);
  I.click({
    xpath: "//mat-row[last()]//mat-icon[contains(text(), 'edit')]"
  });
  I.fillField('Title', 'test2');
  I.fillField('Author', 'test2');
  I.fillField('ISBN', '978-1-78862-070-5');
  I.fillField('Year', '2016');
  I.click('Save');
  I.waitInUrl('/books', 2);
  I.see('test2');
  I.see('978-1-78862-070-5', '.mat-row');
  I.see('2016');
});

Scenario('I can delete a book', function*(I) {
  I.login();
  I.amOnPage('/books');
  I.see('978-1-78862-070-5', '.mat-row');
  const id = yield I.grabTextFrom({ xpath: '//mat-row[last()]/mat-cell[1]' });
  I.click({
    xpath: "//mat-row[last()]//mat-icon[contains(text(), 'delete sweep')]"
  });
  I.dontSee(id, 'mat-cell.mat-column-id');
  I.seeNumberOfElements('.mat-row', 1);
});
