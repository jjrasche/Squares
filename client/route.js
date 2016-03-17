Router.configure({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

///Router.onBeforeAction('dataNotFound');
//Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.route('/', {
  name: 'mainPage',
  // waitOn: function() {
  //   return Meteor.subscribe('getUserBoards', this.params._id);
  // },
});

Router.route('/board/:_id', {
  name: 'boardPage',
  waitOn: function() {
    // var boardHandle = Meteor.subscribe('getBoard', this.params._id);
    // var boardUsersHandle = Meteor.subscribe('getBoardUsers', this.params._id);
    // return [boardHandle, boardUsersHandle];
    // var id = this.params._id
    // return Meteor.subscribe('userData',)
  },
  data: function () {
    var id = this.params._id
    var board = Board.findOne(id);
    if (board)
      Meteor.subscribe('userData',board.members.map(function(m){ return m._id }))

    Session.set('boardPageBoardID', id);
  	console.log("route data: ", id, board);
    return board;
  }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
}


Router.onBeforeAction(requireLogin, {except: ['mainPage']});
Router.onBeforeAction('dataNotFound', {except: ['mainPage']});
