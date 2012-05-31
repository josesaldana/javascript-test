var Model = require('./model');

Value = Model.extend({
  defaults: {
    id: -1,
    value: null
  },

  url: 'rs-js-test-values-' + this.id
});

module.exports = Value;
