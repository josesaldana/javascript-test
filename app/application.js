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
