Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  // Template Helpers
  Template.main.helpers({
    todos: function(){
      return Todos.find({}, {sort: {createdAt: -1}}); //sorts it by latest todo first
    }
  });

  Template.main.events({
    
    "submit .new-todo": function(event){
      var text = event.target.text.value;
      console.log(text);

      Todos.insert({
        text: text,
        createdAt: new Date(),
        userID: Meteor.userId(),
        username: Meteor.user().username
      });

      // Clear Form
      event.target.text.value = '';

      // Prevent Submit
      return false;
    },
    
    "click .toggle-checked": function(){
      Todos.update(this._id, {$set: {checked: ! this.checked}});
    },

    "click .delete-todo": function(){
      if(confirm('Are You Sure?')){
        Todos.remove(this._id);
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })

}


if (Meteor.isServer) {

}
