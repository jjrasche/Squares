SQUARE_EMPTY_VALUE = 'None';
NOT_LOGGED_IN_ERROR = 'User not logged in';
INVALID_BOARD_ERROR = 'Board not found';
INVALID_USER_ERROR = 'Board not found';
INVALID_BOARD_OWNER_ERROR = 'Board owner not found';
CANT_CHANGE_OTHERS_SQUARES_ERROR = 'Only the board owner has permission to change another players squares';



initializeBoard = function initializeBoard() {
	var board = {}
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var key = getSquareKey(i,j);
			board[key] = {
				ownerObject: null,
				ownerID: null//SQUARE_EMPTY_VALUE;
			}
		}
	}
	return board;
}


formatBoardData = function formatBoardData(boardData) {
	var boardArray = []
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			// var key = getSquareKey(i,j); 
			var value = formatCellData(boardData[getSquareKey(i,j)])
			var color = boardData[getSquareKey(i,j)] == Meteor.userId() ? 'yellow' : 'green';
			if (squareSelected(i,j) && Session.get('boardPageEditMode')) {
				color = 'blue';
			}
			//console.log(key, boardData[key]);
			boardArray.push({x: i,y: j,value: value, color: color});
		}
	}
	// console.log(JSON.stringify(boardArray));
	return boardArray;
}

formatCellData = function formatCellData(cellData) {
	return cellData.ownerID != null ? cellData.ownerID : SQUARE_EMPTY_VALUE; 
}


squareSelected = function squareSelected(x, y) {
	var selectedSquares = Session.get('boardPageselectedSquares');
	var sq = selectedSquares.filter(function(ele) {
		return(ele.x == x && ele.y == y);
	})
	return sq.length > 0;
}

getSquareKey = function getSquareKey(x, y) {
	return 'sq'+String(x)+String(y);
}







canModifySquare = function canModifySquare(board, user, x, y) {
	var square = board[getSquareKey(x,y)];
	var user = Meteor.user();

	if (board.locked) return false;
	if (user._id == board.owner) {
		return true;
	}
	else {

	}
}

// can assign a square to an inventation or a 
modifySquare = function modifySquare(board, newOwner, x, y) {
	var square = board[getSquareKey(x,y)];
	var user = Meteor.user();
	var val;

	if (!canModifySquare(board, newOwner, x, y)) 
		throw new Meteor.Error("cannot change square (" + x + "," + y + ")");

	if (userOccupiesSquare(board, user, x, y)) {
		releaseSquare(board, x, y);
	}else if (squareOccupied(board, x, y)) {
		releaseSquare(board, x, y);
		takeSquare(board, user, x, y);
	} else {
		takeSquare(board, user, x, y);
	}


}
/*
 	null out square, 
 	add free square back to owner 
 */
releaseSquare = function releaseSquare(board, x, y) {
	var square = getSquare(board, x, y);
	var owner = getSquareOwner(board, x, y);



}
/*
 	if occupied -->  call remove square
 	add id to new square
 	consume free square from newOwner
*/
takeSquare = function takeSquare(board, newOwner, x, y) {

}


squareOccupied = function squareOccupied(board, x, y) {
	var square = board[getSquareKey(x,y)];
	return square.ownerID == null;
}

userOccupiesSquare = function userOccupiesSquare(board, user, x, y) {
	var square = board[getSquareKey(x,y)];
	return square.ownerID == user._id;
}

getSquareOwner = function getSquareOwner(board, x, y) {
	var square = board[getSquareKey(x,y)];
	var owner = getUser(square.ownerID);
	if (!owner) throw Meteor.Error("user not found");
	return owner;
}

getSquare = function getSquare(board, x, y) {
	return board[getSquareKey(x,y)];
}


getUser = function getUser(userID) {
	return Meteor.users.findOne({_id: userID});
}




