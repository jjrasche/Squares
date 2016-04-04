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








// //Board
// canModifySquare = function canModifySquare(board, user, x, y) {
// 	var square = board.getSquare(x,y);
// 	var user = Meteor.user();

// 	if (board.locked) 
// 		throw new Meteor.Error("board is locked, must unlock to make changes");
// 	// owners have permission to remove/add any member anywhere on board
// 	if (board.isOwner(user)) {
// 		return true;
// 	}
// 	// non-owners can remove self from squares and add self to empty squares
// 	else {
// 		var numFreeSquares = getNumUserFreeSquares(board, user)
// 		// choosing empty square and have enough freeSquares
// 		if (square == SQUARE_EMPTY_VALUE) {
// 			if (numFreeSquares > 0) 
// 				return true;
// 			else 
// 				throw new Meteor.Error("All " + getUserTotalNumSquares(board, user) +
// 										" of your squares are on the board. Remove an" +
// 										" existing one, or contact board owner to select" +
// 										" this square");
// 		}
// 		if (square == user._id) 
// 			return true
// 		else 
// 			throw new Meteor.Error("Cannot remove other player's squares." +
// 								   " Only the board owner has permission to do this.");

// 		return false;
// 	}
// }

// /*
// 	To enforce atomic commits, will compile changes in <set>
// 	and commit them all at once. Still updating board object, 
// 	because need to do validation on it when all changes complete.
// */
// modifySquare = function modifySquare(newOwner, squaresToChange) {
// 	var set = {};

// 	// if user not in board members, add her
// 	if (!this.boardMember(newOwner)) {
// 		var member = {
// 			_id: newOwner._id,
// 			numSquares: squaresToChange.length,
// 			paid: false				
// 		}
// 		this.members.push(member);
// 		set.members = this.members;
// 	}

// 	for (var i = 0; i < squaresToChange.length; i++) {
// 		var x = squaresToChange[i].x; 
// 		var y = squaresToChange[i].y;

// 		if (!this.canModifySquare(newOwner, x, y))
// 			throw new Meteor.Error("you do not have permission to change square (" + x + "," + y + ")");

// 		if (this.userOccupiesSquare(newOwner, x, y)) {
// 			releaseSquare(x, y);
// 		}else if (squareOccupied(x, y)) {
// 			releaseSquare(x, y);
// 			takeSquare(newOwner, x, y);
// 		} else {
// 			takeSquare(newOwner, x, y);
// 		}
// 	}

// 	// If move gives user more squares than in board.members<user>.numSquares 
// 	var newNumSquares = this.usersOccupiedSquares(newOwner).length;
// 	if (this.getBoardMember(newOwner).numSquares < newNumSquares) {
// 		this.members = this.members.map(function(m) {
// 			if (m._id == newOwner._id) m.numSquares = newNumSquares;
// 			return m; 
// 		});
// 		set.members = this.members;
// 	}

// 	SB.Board.update({_id: this._id}, {$set: set})

// 	function releaseSquare(x, y) {
// 		changeSquare(x, y, SQUARE_EMPTY_VALUE);
// 	}
// 	function takeSquare(newOwner, x, y) {
// 		changeSquare(x, y, newOwner._id);
// 	}
// 	function changeSquare(x, y, val) {
// 		var key = SB.Board.getSquareKey(x, y);
// 		this[key] = set[key] = val
// 	}
// }














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
