SQUARE_EMPTY_VALUE = 'None';
NOT_LOGGED_IN_ERROR = 'User not logged in';
INVALID_BOARD_ERROR = 'Board not found';
CANT_CHANGE_OTHERS_SQUARES_ERROR = 'Only the board owner has permission to change another players squares';


Meteor.methods({
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
	modifyBoard: function(boardID, x, y, val) {
		var user = Meteor.user();
		var board = Board.findOne(boardID);
		if (!user)	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		var squareKey = getSquareKey(x,y);
		var squareID = board[squareKey];
		var val;
		// if you already have the square, remove your name
		if (squareID == user._id) val = SQUARE_EMPTY_VALUE;
		// if square is empty take it
		else if(squareID == SQUARE_EMPTY_VALUE) val = user._id;
		// if square is occupied by another only change if owner
		else {
			if (user._id != board.owner) 
				throw new Meteor.Error(CANT_CHANGE_OTHERS_SQUARES_ERROR);
			val = user._id;
		}

		// change owner of square
		var set = {};
	    set[squareKey] = val;

		var ret = Board.update(board, {$set: set});
	    // if user not already on board, add to members
	    if (board.members.indexOf(user._id) == -1) {
	    	set.members = board.members;
	    	set.members.push(user._id);
	    }
// db.products.update(
//    { _id: 100 },
//    { $set:
//       {
//         quantity: 500,
//         details: { model: "14Q3", make: "xyz" },
//         tags: [ "coats", "outerwear", "clothing" ]
//       }
//    }
// )

		var ret = Board.update({_id: board._id}, {$set: set});


		// var ret = Board.update({_id: board._id}, {$set:       
		// 	{
		//         quantity: 500,
		//         details: { model: "14Q3", make: "xyz" },
		//         tags: [ "coats", "outerwear", "clothing" ],
		//         members: ['lsfjlsd','laskjdf','lsdkjf']
		//       }});
		//Board.update("4RDX2ywpQ4K5KneMX", {$set: { sq75: 'na', members: ['lsfjlsd','laskjdf','lsdkjf']}});

	    console.log('set: ', set, ret);

	},
	createBoard: function(name) {
		var user = Meteor.user();
		var board = initializeBoard();
		board.owner = user._id;
		board.members = [user._id];
		board.name = name;
		var boardID = Board.insert(board);
		return boardID;
	}
})

getSquareKey = function getSquareKey(x, y) {
	return 'sq'+String(x)+String(y);
}


initializeBoard = function initializeBoard() {
	var board = {}
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var key = getSquareKey(i,j);
			board[key] = SQUARE_EMPTY_VALUE;
		}
	}
	return board;
}

