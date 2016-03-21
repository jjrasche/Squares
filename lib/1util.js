SQUARE_EMPTY_VALUE = 'None';
NOT_LOGGED_IN_ERROR = 'User not logged in';
INVALID_BOARD_ERROR = 'Board not found';
INVALID_USER_ERROR = 'Board not found';
INVALID_BOARD_OWNER_ERROR = 'Board owner not found';
CANT_CHANGE_OTHERS_SQUARES_ERROR = 'Only the board owner has permission to change another players squares';
NUM_SQUARES = 100;


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

formatBoardData = function formatBoardData() {
	var board = getBoard();
	var games = getGames();
	var matrix = getGamesMatrix(board, games);
	var boardArray = []

	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			// var key = getSquareKey(i,j); 
			var value = formatCellData(board[getSquareKey(x, y)])
			var color = 'brown';			
			if (squareSelected(x, y) && Session.get('boardPageEditMode'))
				color = 'blue';
			// else if (squareContainsInProgressGame(matrix[x][y])))
				
			else if (squareContainsSelectedGame(matrix[x][y]))
				color = 'blue';
			else if (userOccupiesSquare(board, Meteor.user(), x, y)) 
				color = 'orange';
			else if (squareIsEmpty(board, x, y))
				color = 'green';
			//console.log(key, boardData[key]);
			boardArray.push({x: x,y: y,value: value, color: color});
		}
	}
	// console.log(JSON.stringify(boardArray));
	return boardArray;
}

formatCellData = function formatCellData(cellData) {
	if (cellData == SQUARE_EMPTY_VALUE) 
		return SQUARE_EMPTY_VALUE; 
	else {
		var user = getUser(cellData);
		var board = getBoard();
		var ret = user.profile.userName 
				// + getUserOccupiedSquares(board, user).length 
				// + getUserTotalNumSquares(board, user);
		return ret;
	}
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

	if (board.locked) 
		throw new Meteor.Error("board is locked, must unlock to make changes");
	// owners have permission to remove/add any member anywhere on board
	if (isOwner(board, user)) {
		return true;
	}
	// non-owners can remove self from squares and add self to empty squares
	else {
		var numFreeSquares = getNumUserFreeSquares(board, user)
		// choosing empty square and have enough freeSquares
		if (square == SQUARE_EMPTY_VALUE) {
			if (numFreeSquares > 0) 
				return true;
			else 
				throw new Meteor.Error("All " + getUserTotalNumSquares(board, user) +
										" of your squares are on the board. Remove an" +
										" existing one, or contact board owner to select" +
										" this square");
		}
		if (square == user._id) 
			return true
		else 
			throw new Meteor.Error("Cannot remove other player's squares." +
								   " Only the board owner has permission to do this.");

		return false;
	}
}

/*
	must keep track of 
	all square numbers are kept on board object
	must keep track of:
	- number of squares per user
	- uncommitedSquares = 100 - numSquaresForAllUsers
	- freeSquares = numSquares _id == null;

	this does mean the boardOwner needs a separate method to 
	chage number of squares of a member.

	To enforce atomic commits, will compile changes in <set>
	and commit them all at once. Still updating board object, 
	because need to do validation on it when all changes complete.

*/
modifySquare = function modifySquare(board, newOwner, squaresToChange) {
	var set = {};

	// if user not in board members, add her
	if (!userIsMemberOfBoard(board, newOwner)) {
		var member = {
			_id: newOwner._id,
			numSquares: squaresToChange.length,
			paid: false				
		}
		board.members.push(member);
		set.members = board.members;
	}

	for (var i = 0; i < squaresToChange.length; i++) {
		var x = squaresToChange[i].x; 
		var y = squaresToChange[i].y;

		if (!canModifySquare(board, newOwner, x, y))
			throw new Meteor.Error("you do not have permission to change square (" + x + "," + y + ")");

		if (userOccupiesSquare(board, newOwner, x, y)) {
			releaseSquare(x, y);
		}else if (squareOccupied(x, y)) {
			releaseSquare(x, y);
			takeSquare(newOwner, x, y);
		} else {
			takeSquare(newOwner, x, y);
		}
	}

	// If move gives user more squares than in board.members<user>.numSquares 
	var newNumSquares = getUserOccupiedSquares(board, newOwner).length;
	if (getBoardMember(board, newOwner).numSquares < newNumSquares) {
		board.members = board.members.map(function(m) {
			if (m._id == newOwner._id) m.numSquares = newNumSquares;
			return m; 
		});
		set.members = board.members;
	}

	// console.log("changing set: ", set);
	// console.log("board After: ", board);
	// VALIDATIONS
	if(getNumCommittedSquares(board) > NUM_SQUARES)
		throw new Meteor.Error("performing this action will allocate over 100 squares");

	Board.update({_id: board._id}, {$set: set})



	function releaseSquare(x, y) {
		changeSquare(x, y, SQUARE_EMPTY_VALUE);
	}
	function takeSquare(newOwner, x, y) {
		changeSquare(x, y, newOwner._id);
	}
	function changeSquare(x, y, val) {
		var key = getSquareKey(x, y);
		board[key] = set[key] = val
	}
}


getNumUnCommittedSquares = function getNumUnCommittedSquares(board) {
	return NUM_SQUARES - getNumUnCommittedSquares(board);
}

getNumCommittedSquares = function getNumCommittedSquares(board) {
	var ret = 0
	var members = board.members;
	for (var i = 0; i < members.length; i++) {
		ret += members[i].numSquares
	}
	return ret;
}




getUserOccupiedSquares = function getUserOccupiedSquares(board, user) {
	var ret = [];
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < 10; y++) {
			if (userOccupiesSquare(board, user, x, y))
				ret.push({x: x, y: y});
		}
	}
	return ret;
}

getUserTotalNumSquares = function getUserTotalNumSquares(board, user) {
	var boardMember = getBoardMember(board, user);
	return boardMember.numSquares;
}

getNumUserFreeSquares = function(board, user) {
	return getUserTotalNumSquares(board, user) -
			getUserOccupiedSquares(board, user).length;
}

getUserPaid = function getUserPaid(board, user) {
	var boardMember = getBoardMember(board, user);
	return boardMember.paid;
}

getUserWinnings = function getUserWinnings(board, games, user) {
	var squares = getUserOccupiedSquares(board, user);
	var matrix = getGamesMatrix(board, games);
	var winnings = 0;
	for(var i = 0; i < squares.length; i++) {
		winnings += getSquareScoreFromMatrix(board, squares[i], matrix);
	}
	return winnings;
}
getSquareScoreFromMatrix = function getSquareScoreFromMatrix(board, square, matrix) {
	var games = matrix[square.x][square.y];
	var roundValues = board.roundPoints
	var score = 0;
	games.map(function(game) {
		score += roundValues[game.round];
	});
	return score;
}


getBoardMember = function getBoardMember(board, user) {
	if(!board || !user) return;

	var ret = board.members.filter(function(member) {
		return member._id == user._id;
	});
	return ret[0] ? ret[0] : [];
}

getGamesMatrix = function getGamesMatrix(board, games) {
	var matrix = createEmptyMatrix();
	for (var i = 0; i < games.length; i++) {
		var game = games[i];
		var losingDigit= Math.min(game.awayScore, game.homeScore) % 10;
		var winningDigit = Math.max(game.awayScore, game.homeScore) % 10;

		// map to board numbers
		losingDigit = board.loserNumbers.indexOf(losingDigit);
		winningDigit = board.winnerNumbers.indexOf(winningDigit);

		matrix[winningDigit][losingDigit].push(game);
	}
	return matrix;
}
createEmptyMatrix = function createEmptyMatrix() {
	var mat = [];
	for (var x = 0; x < 10; x++) {
		var col = [];
		for (var y = 0; y < 10; y++) {
			col.push([]);
		}
		mat.push(col);
	}
	return mat;
}





squareOccupied = function squareOccupied(board, x, y) {
	var square = board[getSquareKey(x,y)];
	return square == null;
}

userOccupiesSquare = function userOccupiesSquare(board, user, x, y) {
	var square = board[getSquareKey(x,y)];
	return square == user._id;
}

getSquareOwner = function getSquareOwner(board, x, y) {
	var square = board[getSquareKey(x,y)];
	var owner = getUser(square);
	if (owner != null && !owner) throw Meteor.Error("user not found");
	return owner;
}

getSquare = function getSquare(board, x, y) {
	return board[getSquareKey(x,y)];
}


getUser = function getUser(userID) {
	return Meteor.users.findOne({_id: userID});
}

getBoard = function getBoard(boardID) {

	return Board.findOne({_id: boardID});
}
getBoard = function getBoard() {
	var boardID = Session.get('boardPageBoardID');
	return Board.findOne({_id: boardID});
}

getGames = function getGames(query, sort) {
	var baseQuery = [{date: {$gte: new Date(2016,01,01)}}];
	if (!sort) sort = {};
	if (!query) query = [];
	var parms = query.concat(baseQuery);
	var ret = Game.find({$and: parms}, {sort: sort}).fetch();

	// console.log('getGames: ', JSON.stringify(parms), sort, ret.length);
	return ret;
}

userIsMemberOfBoard = function userIsMemberOfBoard(board, user) {
  return board.members.filter(function(member) {
		    return (member._id == user._id);
		  }).length > 0;
}

getBoardMemberUsers = function getBoardMemberUsers(board) { 
	if (!board) throw Meteor.Error("getBoardMemberUsers board is bad");
	var mem = board.members.map(function(member) {
		return Meteor.users.findOne(member._id);
	})
	return mem;
}


squareIsEmpty = function squareIsEmpty(board, x, y) {
	return getSquare(board, x, y) == SQUARE_EMPTY_VALUE;
}

squareContainsSelectedGame = function squareContainsSelectedGame(squareGames) {
	for (var i = 0; i < squareGames.length; i++) {
		if (gameIsSelected(squareGames[i]._id))
			return true;
	}
	return false;
}

squareContainsInProgressGame = function squareContainsInProgressGame() {

}


gameIsSelected = function gameIsSelected(gameID) {
	var selectedGames = Session.get('boardPageselectedGames');
	return selectedGames.indexOf(gameID) != -1
}


isOwner = function isOwner(board, user) {
	var ret = board.owners.filter(function(m) { 
			// console.log(m, user._id)
			return m == user._id
		}).length > 0;
	return ret;
}







getUserBoards = function getUserBoards(user) {
	var boardObjects = [];
	var boardIDs = user.profile.boardIDs;
	for (var i = 0; i < boardIDs.length; i++) {
		var board = Board.findOne(boardIDs[i])
		boardObjects.push(board);
	}
	return boardObjects;
}





sleep = function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

shuffle = function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


// mm/dd M:ss
 Date.prototype.messageFormat = function() {
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var M = this.getMinutes().toString();
   var ss = this.getSeconds().toString();

   return (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "  " + M + ":" + ss;
};



getBeginningTodayDate = function getBeginningTodayDate() {
  var d = new Date();
  return d.getClearedTimeOfDateTime()
}
getEndTodayDate = function getEndTodayDate() {
  var d = new Date();
  return d.getMaxTimeOfDateTime()
}
getMostRecentGameDate = function getMostRecentGameDate() {
	var mostRecentGame = getGames([], {date: -1})[0];
	return mostRecentGame.date.getClearedTimeOfDateTime();
}
getBeginningYesterdayDate = function getBeginningYesterdayDate() {
  var d = new Date();
  d.addDays(-1)
  return d.getClearedTimeOfDateTime()
}

Date.prototype.addDays = function(numDays) {
	this.setDate(this.getDate() + numDays);
}
Date.prototype.getClearedTimeOfDateTime = function getClearedTimeOfDateTime() {
	var tmpDate = new Date(this);
	tmpDate.setHours(0,0,0,0);
	return tmpDate;
}
Date.prototype.getMaxTimeOfDateTime = function getMaxTimeOfDateTime() {
	var tmpDate = new Date(this);
	tmpDate.setHours(23,59,59,999);
	return tmpDate;
}

Number.prototype.format2DigitString = function format2DigitString(){
	if(this >= 0 && this < 10) {
		return '0' + String(this);
	}
	return String(this);
}



/*
	queries 
	Meteor.users.find({}, {sort: {['status.online': -1,username: -1]}}).fetch().map(function(u){ return u.username })
*/
