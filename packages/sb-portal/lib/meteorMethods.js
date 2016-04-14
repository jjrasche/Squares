Meteor.methods({
	createBoard: function(boardName, userID) {
		var user = SB.User.findOne(userID);

		if (SB.debug) {
			console.log("---- createBoard ----");
			console.log("boardName: ", boardName);
			console.log("userID: ", userID, user._id);
		}
		if (!user) throw new Meteor.Error(SB.ErrMsg.INVALID_USER_ERROR);

		board = SB.Board.initializeBoard();
		board.owners = [userID];
		board.name = boardName;
		board.members = [{
			_id: userID,
			numSquares: 0,
			paid: false
		}];
		board.locked = false;
		var boardID = SB.Board.insert(board);

		// add board to user's boardIDs
		var boardIDs = user.profile.boardIDs; 
		boardIDs.push(boardID);
		Meteor.users.update(user._id, {$set: {'profile.boardIDs': boardIDs}});

		return boardID;
	}
})