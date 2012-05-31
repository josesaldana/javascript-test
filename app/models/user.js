var Model = require('./model');

User = Model.extend({
  /*defaults: {
    name: "Joe",
    value: "Unset"
  },*/

  initialize: function() {
    this.save();
  },

  url: 'rs-js-test-users-' + this.id
});

module.exports = User;
