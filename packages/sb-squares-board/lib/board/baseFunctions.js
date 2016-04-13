SB.namespacer('SB.ErrMsg', {INVALID_BOARD_ERROR : 'Board not found'});
SB.namespacer('SB.ErrMsg', {INVALID_USER_ERROR : 'User not found'});
SB.namespacer('SB.ErrMsg', {NOT_LOGGED_IN_ERROR : 'User not logged in'});
SB.namespacer('SB.ErrMsg', {INVALID_BOARD_OWNER_ERROR : 'Board owner not found'});

NUM_SQUARES = 100;
SQUARE_EMPTY_VALUE = 'None';


SB.namespacer('SB', {Board: 
  new Mongo.Collection('boards', {
    transform: function (doc) { 
      return new SB.Board.model(doc);
    }
  })
});


SB.namespacer('SB.Board', {model :
  function(doc) {
    _.extend(this, doc);
  }
});

// instance methods
_.extend(SB.Board.model.prototype, {
  formatData : function formatData() {
    var matrix = this.gamesMatrix();
    var boardArray = []

    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        var value = this.formatCellData(x,y);
        var color = 'brown';      
        if (squareSelected(x, y) && Session.get('boardPageEditMode'))
          color = 'blue';
        // else if (squareContainsInProgressGame(matrix[x][y])))          
        else if (squareContainsSelectedGame(matrix, x, y))
          color = 'blue';
        else if (this.userOccupiesSquare(SB.User.user(), x, y)) 
          color = 'orange';
        else if (this.squareIsEmpty(x, y))
          color = 'green';
        boardArray.push({x: x,y: y,value: value, color: color});
      }
    }
    return boardArray;
  },
  formatCellData : function formatCellData(x, y) {
    var cellData = this.getSquare(x,y)
    if (cellData == SQUARE_EMPTY_VALUE) 
      return SQUARE_EMPTY_VALUE; 
    else {
      var user = SB.User.findOne(cellData);
      var ret = user.username;
      return ret;
    }
  },
  getSquare : function getSquare(x, y) {
      return this[SB.Board.getSquareKey(x,y)];
  },
  squareIsEmpty : function squareIsEmpty(x, y) {
    return this.getSquare(x,y) == SQUARE_EMPTY_VALUE;
  },
  memberIDs : function memberIDs() { 
    return this.members.map(function(member) {
      return member._id;
    });
  },
  memberQuery : function memberQuery() { 
    return SB.User.find({_id: {$in: this.memberIDs()}})
  },
  getMembers : function getMembers() { 
    return this.memberQuery().fetch();
  },  
  numUnCommittedSquares : function getNumUnCommittedSquares() {
    return NUM_SQUARES - this.getNumUnCommittedSquares();
  },
  numCommittedSquares : function getNumCommittedSquares() {
    var ret = 0
    var members = this.members;
    for (var i = 0; i < members.length; i++) {
      ret += members[i].numSquares
    }
    return ret;
  },
  isOwner : function isOwner(user) {
    var ret = this.owners.filter(function(m) { 
        return m == user._id
      }).length > 0;
    return ret;
  },
  usersOccupiedSquares : function usersOccupiedSquares(user) {
    var ret = [];
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        if (this.userOccupiesSquare(user, x, y))
          ret.push({x: x, y: y});
      }
    }
    return ret;
  },
  userOccupiesSquare : function userOccupiesSquare(user, x, y) {
    var square = this.getSquare(x,y);
    return square == user._id;
  },

  boardMember : function boardMember(user) {
    // if(!board || !user) return;
    var ret = this.members.filter(function(member) {
      return member._id == user._id;
    });
    return ret[0] ? ret[0] : false;
  },
  memberNumSquares : function memberNumSquares(user) {
    var boardMember = this.boardMember(user);
    return boardMember.numSquares;
  },
  memberPaid : function memberPaid(user) {
    var boardMember = this.boardMember(user);
    return boardMember.paid;
  },
  memberWinnings : function memberWinnings(games, user) {
    if (!this.locked) return 0;

    var squares = this.usersOccupiedSquares(user);
    var matrix = this.gamesMatrix();
    var winnings = 0;
    for(var i = 0; i < squares.length; i++) {
      winnings += this.squareTotalWinnings(squares[i], matrix);
    }
    return winnings;
  },

  memberFreeSquares : function memberFreeSquares(user) {
    return this.getUserTotalNumSquares(user) -
        this.usersOccupiedSquares(user).length;
  },
  squareOccupied : function squareOccupied(x, y) {
    var square = this.getSquare(x,y);
    return square == null;
  },
  squareTotalWinnings : function squareTotalWinnings(square, matrix) {
    if (!this.locked) return 0;
    
    var board = this;
    var games = matrix[square.x][square.y];
    var score = 0;
    games.map(function(game) {
      score += board.gamePoints(game);
    });
    return score;
  },
  // getSquareOwner = function getSquareOwner(board, x, y) {
  //   var square = board.getSquare(x,y);
  //   var owner = getUser(square);
  //   if (owner != null && !owner) throw Meteor.Error("user not found");
  //   return owner;
  // }

  // TODO: can I reacitvely update gamesMatrix if it is data member of Board???
  gamesMatrix : function gamesMatrix() {
    if (!this.locked) return null;
    var matrix = createEmptyMatrix();
    var games = this.games();
    for (var i = 0; i < games.length; i++) {
      var game = games[i];
      var losingDigit= Math.min(game.awayScore, game.homeScore) % 10;
      var winningDigit = Math.max(game.awayScore, game.homeScore) % 10;

      // map to board numbers
      losingDigit = this.loserNumbers.indexOf(losingDigit);
      winningDigit = this.winnerNumbers.indexOf(winningDigit);

      matrix[winningDigit][losingDigit].push(game);
    }
    return matrix;
  },
  games : function games() {
    return this.gameQuery().fetch();
  },
  gameQuery : function gameQuery() {
    // TODO make this query specific to data from baord
    var sort = {}; query = [{finished: true}, {date: {$gte: new Date(2016,01,01)}}];
    var ret = SB.Game.find({$and: query}, {sort: sort});
    return ret;    
  },
  gamePoints : function gamePoints(game) {
    var roundValues = this.roundPoints
    return roundValues[game.round];
  },
});


var createEmptyMatrix = function createEmptyMatrix() {
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



