var User = require('./user');

var Collection = require('./collection');

UsersCollection = Collection.extend({
  model: User,
  localStorage: new Store("rs-js-test-users")

});

module.exports = UsersCollection;
