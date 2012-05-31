var Value = require('./value');

var Collection = require('./collection');

ValuesCollection = Collection.extend({
  model: Value,
  localStorage: new Store("rs-js-test-values"),

  initialize: function() {
    this.fetch();
  }
});

module.exports = ValuesCollection;
