Router.route('/', {
  name: 'portal',
  // waitOn: function() {
  //   return Meteor.subscribe('getUserBoards', this.params._id);
  // },
});

Router.onBeforeAction(SB.Router.requireLogin, {except: ['portal']});
Router.onBeforeAction('dataNotFound', {except: ['portal']});
