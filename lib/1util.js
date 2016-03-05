SQUARE_EMPTY_VALUE = 'None';
NOT_LOGGED_IN_ERROR = 'User not logged in';
INVALID_BOARD_ERROR = 'Board not found';
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
modifySquare = function modifySquare(board, user, x, y) {
	var square = board[getSquareKey(x,y)];
	var user = Meteor.user();
	var val;

	// if 

}






