Meteor.publish('getBoard', function(id) {
	return Board.find(id);
});

Meteor.publish('getBoardUsers', function(id) {
	var board = Board.find(id);
	return Meteor.users.find({_id: {$in: board.members}});
});

Meteor.publish('getUserBoards', function(id) {
	var boardIDs = Meteor.user().profile.boardIDs;
	return Board.find({_id: {$in: boardIDs}});
});

Meteor.publish("userData", function (userIDs) {
    return Meteor.users.find({_id: {$in: userIDs}},{
    	fields: {
        	'status': 1
        }
    });
});