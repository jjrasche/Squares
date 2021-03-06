Router.route('/board/:_id', {
  name: 'sbSquaresBoardPage',
  waitOn: function() {
    var boardID = this.params._id;
    return [Meteor.subscribe('board', boardID),
            Meteor.subscribe('boardMembers', boardID),
            Meteor.subscribe('boardGames', boardID)];
  },
  data: function () {

    if (SB.User.user())
      Session.set('chapp-username', SB.User.user().username);
    Session.set('chapp-docid', this.params._id);
    Session.set('chapp-historysince',new Date());

    // Session.set('boardPageBoardID', id);
  	// console.log("route data: ", id, board);
    return SB.Board.findOne(this.params._id);
  }
});