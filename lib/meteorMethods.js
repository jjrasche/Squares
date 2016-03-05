/*
	TODO
	- action logic 
	- 
*/

// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	sendInvitation: function(email, userName, boardID, squares) {
		if (Meteor.isServer) {
      		var board = Board.findOne({_id: boardID});
      		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
      		var boardOwner = Meteor.users.findOne({_id: board.owner});
			if (!board) throw new Meteor.Error(INVALID_BOARD_OWNER_ERROR);


			var inv = {	email: email, 
						userName: userName,
						dateRequested: Date(),
						token: Random.hexString(15),
						board: {
							_id: board._id,
							numSquares: squares.length
						}
					};
			var invID = Invitation.insert(inv);
			if (invID == 0) throw new Meteor.Error("Invitation not stored");


			SSR.compileTemplate('invitationEmailHTML', Assets.getText( 'invitationEmail.html' ) );
			var emailData = {
			  userName: userName,
			  boardName: board.name ? board.name : 'boardName',
			  numSquares: squares.length,
			  boardOwner: boardOwner.name ? boardOwner.name : 'boardOwner',
			  token: inv.token
			};
			console.log('emailData: ', emailData);
			console.log('email render: ', SSR.render('invitationEmailHTML', emailData))

			// try to send invitation
			Email.send({
		      to: email,
		      from: "squares@webhop.me",
		      subject: "NCAA squares invitation",
		      html: SSR.render('invitationEmailHTML', emailData)
		    })
		    return invID;
		}
	},
	/*
		rules:
			square == open
				if boardOwner		opens dialog to add user or freeform
				else				sets user as cellOwner

			square == taken
				if boardOwner		removes cellOwner
				if squareOwner		removes cellOwner
				if !squareOwner		returns error
	*/
	modifyBoard: function(boardID, squaresToChange) {
		console.log("boardID, squaresToChange, edit: ", boardID, squaresToChange);
		var user = Meteor.user();
		var board = Board.findOne(boardID);
		if (!user)	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);

		// change owner of squares
		var set = {};
		for (var i = 0; i < squaresToChange.length; i++) {
			var sq = squaresToChange[i];
			var squareKey = getSquareKey(sq.x,sq.y);
			var squareID = board[squareKey];
			var val;
			// if you already have the square, remove your name
			if (squareID == user._id) {
				val = SQUARE_EMPTY_VALUE;
			}
			// if square is empty take it
			else if(squareID == SQUARE_EMPTY_VALUE) {
				val = user._id;
			}
			// if square is occupied by another only change if owner
			else {
				if (user._id != board.owner) 
					throw new Meteor.Error(CANT_CHANGE_OTHERS_SQUARES_ERROR);
				val = user._id;
			}

			console.log(val, sq);
	    	set[squareKey] = val;
		}
		console.log("set: ", set);

		var ret = Board.update(board, {$set: set});
		return ret;
	},
	createBoard: function(name) {
		var user = Meteor.user();
		var board = initializeBoard();
		board.owner = user._id;
		board.name = name;
		// board.locked = false
		var boardID = Board.insert(board);
		return boardID;
	}
})
