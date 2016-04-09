Meteor.publish('getBoard', function(id) {
	return SB.Board.find(id);
});

Meteor.publish('getBoardUsers', function(id) {
	var board = SB.Board.find(id);
	return SB.User.find({_id: {$in: board.members}});
});

Meteor.publish('getUserBoards', function(id) {
	var boardIDs = SB.User.user().profile.boardIDs;
	return SB.Board.find({_id: {$in: boardIDs}});
});

Meteor.publish("userData", function (userIDs) {
    return SB.User.find({_id: {$in: userIDs}},{
    	fields: {
        	'status': 1
        }
    });
});