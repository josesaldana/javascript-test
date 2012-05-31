(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    // Application bootstrapper.
Application = {
  initialize: function() {
    var Users = require('models/users_collection');
    var Values = require('models/values_collection');
    var Value = require('models/value');

    var HomeView = require('views/home_view');
    var Router = require('lib/router');
   
    var initialUsers = new Users(); initialUsers.url = '/users.json';
    var initialValues = new Values(); initialValues.url = '/values.json';

    //if(initialUsers.fetch().length < 1)
      initialUsers.create({name: "Jose", value: false}).save();

    //if(initialValues.size().length < 1)
      _.each([
         {id: 1, value: "Value 1"}, 
         {id: 2, value: "Value 2"},
         {id: 3, value: "Value 3"},
         {id: 4, value: "Value 4"}
      ], function(value) { 
        initialValues.create(value).save(); 
      });

    this.homeView = new HomeView({model: initialUsers});
    this.homeView.setState(this.homeView.states.NORMAL);

    this.router = new Router();
    if (typeof Object.freeze === 'function') Object.freeze(this);
  }
}

module.exports = Application;

  }
}));
(this.require.define({
  "initialize": function(exports, require, module) {
    var application = require('application');

$(function() {
  application.initialize();
  Backbone.history.start();
});

  }
}));
(this.require.define({
  "lib/router": function(exports, require, module) {
    var application = require('application');

module.exports = Backbone.Router.extend({
  routes: {
    '': 'home'
  },

  home: function() {
    application.homeView.render();
  }

});

  }
}));
(this.require.define({
  "lib/view_helper": function(exports, require, module) {
    // Put your handlebars.js helpers here.

  }
}));
(this.require.define({
  "models/collection": function(exports, require, module) {
    // Base class for all collections.
module.exports = Backbone.Collection.extend({
  
});

  }
}));
(this.require.define({
  "models/model": function(exports, require, module) {
    // Base class for all models.
module.exports = Backbone.Model.extend({
  
});


  }
}));
(this.require.define({
  "models/user": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "models/users_collection": function(exports, require, module) {
    var User = require('./user');

var Collection = require('./collection');

UsersCollection = Collection.extend({
  model: User,
  localStorage: new Store("rs-js-test-users")

});

module.exports = UsersCollection;

  }
}));
(this.require.define({
  "models/value": function(exports, require, module) {
    var Model = require('./model');

Value = Model.extend({
  defaults: {
    id: -1,
    value: null
  },

  url: 'rs-js-test-values-' + this.id
});

module.exports = Value;

  }
}));
(this.require.define({
  "models/values_collection": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/home_view": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/templates/user/edit": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'id':('user-form') }));
buf.push('><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><span');
buf.push(attrs({ 'id':('name') }));
buf.push('>');
var __val__ = user.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>: \n<span');
buf.push(attrs({ 'id':('value') }));
buf.push('></span></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><a');
buf.push(attrs({ 'id':('save') }));
buf.push('>Save</a><a');
buf.push(attrs({ 'id':('cancel') }));
buf.push('>Cancel</a></div></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "views/templates/user/show": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ 'id':('user-form') }));
buf.push('><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><span');
buf.push(attrs({ 'id':('name') }));
buf.push('>');
var __val__ = user.name
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</span>:\n<span');
buf.push(attrs({ 'id':('value') }));
buf.push('><b>' + escape((interp = user.value) == null ? '' : interp) + '</b></span></div><div');
buf.push(attrs({ "class": ('row') }));
buf.push('><a');
buf.push(attrs({ 'id':('edit'), 'href':('#') }));
buf.push('>Edit</a></div></div>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "views/templates/value/edit": function(exports, require, module) {
    module.exports = function anonymous(locals, attrs, escape, rethrow) {
var attrs = jade.attrs, escape = jade.escape, rethrow = jade.rethrow;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<select');
buf.push(attrs({ 'id':('value') }));
buf.push('><option');
buf.push(attrs({ 'name':("-1") }));
buf.push('>Please select</option>');
// iterate values
(function(){
  if ('number' == typeof values.length) {
    for (var $index = 0, $$l = values.length; $index < $$l; $index++) {
      var v = values[$index];

buf.push('<option');
buf.push(attrs({ 'name':("" + (v.attributes.id) + "") }));
buf.push('>');
var __val__ = v.attributes.value
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option>');
    }
  } else {
    for (var $index in values) {
      var v = values[$index];

buf.push('<option');
buf.push(attrs({ 'name':("" + (v.attributes.id) + "") }));
buf.push('>');
var __val__ = v.attributes.value
buf.push(escape(null == __val__ ? "" : __val__));
buf.push('</option>');
   }
  }
}).call(this);

buf.push('</select>');
}
return buf.join("");
};
  }
}));
(this.require.define({
  "views/value_view": function(exports, require, module) {
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

  }
}));
(this.require.define({
  "views/view": function(exports, require, module) {
    require('lib/view_helper');

// Base class for all views.
module.exports = Backbone.View.extend({
  initialize: function() {
    this.render = _.bind(this.render, this);
  },

  template: function() {},
  getRenderData: function() {},

  render: function() {
    this.$el.html(this.template(this.getRenderData()));
    this.afterRender();
    return this;
  },

  afterRender: function() {}
});

  }
}));
