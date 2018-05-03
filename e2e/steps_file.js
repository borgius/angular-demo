'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({
    login: function() {
      this.amOnPage('/login');
      this.see('Login');
      this.fillField('username', 'admin');
      this.fillField('password', 'admin');
      this.click('Login', '.login');
    }
    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
  });
};
