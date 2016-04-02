/*
Independent elements Board, Games, Users, Messages, 
Board has:
- games
	- through gameType (NCAA tournament, SuperBowl) and gameYear
- users
- messages

User has:
- boards
	- messages


*/






SQUARE_EMPTY_VALUE = 'None';
NOT_LOGGED_IN_ERROR = 'User not logged in';
INVALID_BOARD_ERROR = 'Board not found';
INVALID_USER_ERROR = 'Board not found';
INVALID_BOARD_OWNER_ERROR = 'Board owner not found';
CANT_CHANGE_OTHERS_SQUARES_ERROR = 'Only the board owner has permission to change another players squares';
NUM_SQUARES = 100;


//Board
canModifySquare = function canModifySquare(board, user, x, y) {
	var square = board.getSquare(x,y);
	var user = Meteor.user();

	if (board.locked) 
		throw new Meteor.Error("board is locked, must unlock to make changes");
	// owners have permission to remove/add any member anywhere on board
	if (board.isOwner(user)) {
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
	var newNumSquares = board.usersOccupiedSquares(newOwner).length;
	if (getBoardMember(board, newOwner).numSquares < newNumSquares) {
		board.members = board.members.map(function(m) {
			if (m._id == newOwner._id) m.numSquares = newNumSquares;
			return m; 
		});
		set.members = board.members;
	}

	Board.update({_id: board._id}, {$set: set})

	function releaseSquare(x, y) {
		changeSquare(x, y, SQUARE_EMPTY_VALUE);
	}
	function takeSquare(newOwner, x, y) {
		changeSquare(x, y, newOwner._id);
	}
	function changeSquare(x, y, val) {
		var key = Board.getSquareKey(x, y);
		board[key] = set[key] = val
	}
}


getGamePoints = function getGamtePoints(board, game) {
	var roundValues = board.roundPoints
	return roundValues[game.round];
}







// session vars
squareSelected = function squareSelected(x, y) {
	var selectedSquares = Session.get('boardPageselectedSquares');
	var sq = selectedSquares.filter(function(ele) {
		return(ele.x == x && ele.y == y);
	})
	return sq.length > 0;
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

//*************************** user ***************************
getUserBoards = function getUserBoards(user) {
	var boardObjects = [];
	var boardIDs = user.profile.boardIDs;
	for (var i = 0; i < boardIDs.length; i++) {
		var board = Board.findOne(boardIDs[i])
		boardObjects.push(board);
	}
	return boardObjects;
}
//**********************************************************




// game
gameIsSelected = function gameIsSelected(gameID) {
	var selectedGames = Session.get('boardPageselectedGames');
	return selectedGames.indexOf(gameID) != -1
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
	if (mostRecentGame == undefined) return null;
	return mostRecentGame.date.getClearedTimeOfDateTime();
}
getBeginningYesterdayDate = function getBeginningYesterdayDate() {
  var d = new Date();
  d.addDays(-1)
  return d.getClearedTimeOfDateTime()
}

Date.prototype.addDays = function(numDays) {
	this.setDate(this.getDate() + numDays);
};
Date.prototype.getClearedTimeOfDateTime = function getClearedTimeOfDateTime() {
	var tmpDate = new Date(this);
	tmpDate.setHours(0,0,0,0);
	return tmpDate;
};
Date.prototype.getMaxTimeOfDateTime = function getMaxTimeOfDateTime() {
	var tmpDate = new Date(this);
	tmpDate.setHours(23,59,59,999);
	return tmpDate;
};
Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};
Date.prototype.getMostRecentMonday = function() {
  var d = new Date(this);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};
Date.prototype.messageFormat = function() {
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   var M = this.getMinutes().toString();
   var ss = this.getSeconds().toString();

   return (mm[1]?mm:"0"+mm[0]) + "/" + (dd[1]?dd:"0"+dd[0]) + "  " + M + ":" + ss;
};

Number.prototype.format2DigitString = function format2DigitString(){
	if(this >= 0 && this < 10) {
		return '0' + String(this);
	}
	return String(this);
}

String.prototype.parseYYYYmmddDate = function() {
    var y = this.substr(0,4),
        m = this.substr(4,2) - 1,
        d = this.substr(6,2);
    var D = new Date(y,m,d);
    return (D.getFullYear() == y && D.getMonth() == m && D.getDate() == d) ? D : 'invalid date';
}

/*
	queries 
	Meteor.users.find({}, {sort: {['status.online': -1,username: -1]}}).fetch().map(function(u){ return u.username })
	Meteor.users.find({'status.lastLogin': {$exists: true}}, {sort: {'status.lastLogin.date': -1}}).map(function(u) { console.log(u.username + '  ' + u.status.lastLogin.date) })
*/
