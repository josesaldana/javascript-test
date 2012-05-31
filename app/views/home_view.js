var Values = require('/models/values_collection');

var View = require('./view');
var ValueView = require('./value_view');

var show = require('./templates/user/show');
var edit = require('./templates/user/edit');

module.exports = View.extend(Stately).extend({
  id: 'home-view',
  el: 'body',
  valuesView: new ValueView(),

  initialize: function() {
    _.bindAll(this, 'render');
    this.valuesView.on("change:value", function() { console.log("value changed"); });
    this.$el.bind("change:value", this.valueChanged, this);
  },

  templates: {
    edit: edit,
    show: show
  },

  states: {
    EDITING: "EDITING",
    NORMAL: "NORMAL"
  },

  transitions: {
    EDITING: {
      "before_transition": function() { },
      "after_transition": function() { }
    }
  },

  events: {
    'click #edit': 'edit',
    'click #save': 'save',
    'click #cancel' : 'cancel'
  },

  valueChanged: function(a) {
    console.log("value changed");
  },

  edit: function() {
    console.log("Editing...");
    this.setState(this.states.EDITING);
    this.$el.html("");
    this.render();
  },

  save: function() {
    console.log("Saving..."); 
  },

  cancel: function() {
    console.log("Canceling...");
    this.setState(this.states.NORMAL);
    this.$el.html("");
    this.render();
  },

  render: function() {
    if(this.getState() == this.states.EDITING) {
        var html = this.templates.edit({"user": this.model.models[0].toJSON()});
        this.$el.append(html);

        var values = new ValueView();
        values.render();
    } else {
      this.revalidateState(function() {
        var html = this.templates.show({user: this.model.models[0].toJSON()});
        this.$el.append(html);
      });

      return this;
    }
  },

  setState: function(state) {
    this.nextState = state;
    this.revalidateState();
  },

  getState: function() {
    return this.nextState;
  }
});
