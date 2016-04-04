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
    var board = SB.Board.findOne(id);
    if (board)
      Meteor.subscribe('userData',board.members.map(function(m){ return m._id }))

    if (Meteor.user())
      Session.set('chapp-username', Meteor.user().profile.userName);
    Session.set('chapp-docid', id);
    Session.set('chapp-historysince',new Date());

    Session.set('boardPageBoardID', id);
  	// console.log("route data: ", id, board);
    return board;
  }
});