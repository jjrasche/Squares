Meteor.methods({
	'sendMessage': function sendMessage(boardID, message){
		var board = Board.findOne(boardID);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);

			if (message.value != '') {
				return Message.insert({
					userID: Meteor.userId(),
					boardID: board._id,
					message: message,
					date: new Date()
				});
			}
	}
})