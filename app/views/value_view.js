var Values = require('/models/values_collection');

var View = require('./view');

module.exports = View.extend({
  id: 'user-value-view',
  el: 'span#value',
  template: require('./templates/value/edit'),

  events: {
    'change #value' : 'valueChanged'
  },

  initialize: function() {
    this.model = new Values();
    this.model.fetch();
  },

  valueChanged: function(e) {
    var selectedValue = $(e.currentTarget).find("select#value").val();
    this.trigger("change:value", selectedValue);
  },

  render: function() {
    var html = this.template({values: this.model.models});
    console.log(html);
    this.$el.append(html);
  }
});
