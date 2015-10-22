Todos = new Mongo.Collection('todos');

if (Meteor.isClient) {
  Meteor.subscribe('todos');

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

      Meteor.call('addTodo', text);

      // Clear Form
      event.target.text.value = '';

      // Prevent Submit
      return false;
    },
    
    "click .toggle-checked": function(){
      Meteor.call('setChecked', this._id, !this.checked);
    },

    "click .delete-todo": function(){
      if(confirm('Are You Sure?')){
        Meteor.call('deleteTodo', this._id);
      }
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  })

}

if (Meteor.isServer) {
  Meteor.publish('todos', function(){
    return Todos.find();
  });
}

//Meteor Methods
Meteor.methods({
  
  addTodo: function(text){
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized')
    }
    Todos.insert({
      text: text,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  
  deleteTodo: function(todoId){
    Todos.remove(todoId);
  },

  setChecked: function(todoId, setChecked){
    Todos.update(todoId, {$set: {checked: setChecked}});
  }

});