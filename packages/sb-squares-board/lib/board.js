SB.namespacer('SB', {Board: 
  new Mongo.Collection('boards', {
    transform: function (doc) { 
      return new BoardModel(doc);
    }
  })
});


BoardModel = function(doc) {
  _.extend(this, doc);
};

// instance methods
_.extend(BoardModel.prototype, {
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
        else if (squareContainsSelectedGame(matrix[x][y]))
          color = 'blue';
        else if (this.userOccupiesSquare(Meteor.user(), x, y)) 
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
      var user = getUser(cellData);
      var ret = user.profile.userName;
      return ret;
    }
  },
  getSquare : function getSquare(x, y) {
      return this[SB.Board.getSquareKey(x,y)];
  },
  squareIsEmpty : function squareIsEmpty(x, y) {
    return this.getSquare(x,y) == SQUARE_EMPTY_VALUE;
  },
  getUsers : function members() { 
    return this.members.map(function(member) {
      return Meteor.users.findOne(member._id);
    })
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
    var board = this;
    var games = matrix[square.x][square.y];
    var score = 0;
    games.map(function(game) {
      score += getGamePoints(board, game);
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
    // TODO make this query specific to data from baord
    var sort = {}; query = [{finished: true}, {date: {$gte: new Date(2016,01,01)}}];
    var ret = Game.find({$and: query}, {sort: sort}).fetch();
    return ret;
  }
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

// static methods
_.extend(SB.Board, {
  initializeBoard : function initializeBoard() {
    var board = {}
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        var key = this.getSquareKey(i,j);
        board[key] = SQUARE_EMPTY_VALUE;
      }
    }
    return board;
  },
  getSquareKey : function getSquareKey(x, y) {
    return 'sq'+String(x)+String(y);
  }
});


// Board action validations
BoardModel.validate = {};

BoardModel.validate.modifySquare = function modifySquare(boardID, x, y) {
  var board = Board.findOne(boardID);
  var user = Meteor.user()

  if (!user) throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
  if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
  if (!user) throw new Meteor.Error(INVALID_USER_ERROR);

  if (!boardID) throw new Meteor.Error("boardID not set");

  var board = SB.Board.findOne(boardID)
  if (!board) throw new Meteor.Error("boardID " + boardID + " doesn't exist");

  var square = board.getSquare(x,y);
  var user = Meteor.user();

  // owners have permission to remove/add any member anywhere on board
  // non-owners can remove self from squares and add self to empty squares
  if (board.locked) return false;
    // VALIDATIONS
  if(board.getNumCommittedSquares() > NUM_SQUARES)
    throw new Meteor.Error("performing this action will allocate over 100 squares");
  if (board.isOwner(user)) return true;
  else {
    var numFreeSquares = getNumUserFreeSquares(board, user)
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



//----------------- SCHEMA -----------------\\

var schemaObject = {
  "name": {
    type: String,
    label: "name for the board."
  },
  "roundPoints": {
    type: [Number],
    minCount: 7,
    maxCount: 7,
    defaultValue: [0,5,10,20,40,80,200]
  },
  "owners": {
    type: [String],
    label: "ID of the owner of the board"
  },
  "locked": {
    type: Boolean,
    label: "The token for this invitation.",
    defaultValue: false
  },
  "winnerNumbers": {
    type: [Number],
    label: "Order of the numbers of winner score",
    optional: true,
  },
  "loserNumbers": {
    type: [Number],
    label: "Order of the numbers of loser score",
    optional: true,
  },
  "dateCreated": {
    type: Date,
    label: "The date board was created",
    optional: true
  },
  "members": {
    type: Array,
    label: "List of members who have squares on this table"
  },
  "members.$": {
    type: Object,
  },
  "members.$._id": {
    type: String,
    label: "ID of member tied to this board."
  },
  "members.$.numSquares": {
    type: Number,
    label: "Number of squares alloted to this particular user."
  },
  "members.$.paid": {
    type: Boolean,
    label: "Wether this member is paid in full."
  }
}
// add all sq objects to the schema
for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 10; y++) {
    var obj = {
      type: String,
      label: "ID of owner of square in position (" + x + ", " + y + ") in the 10 x 10 map", 
      optional: true
    }
    schemaObject[SB.Board.getSquareKey(x, y)] = obj;
  }
}


var BoardSchema = new SimpleSchema(schemaObject);
SB.Board.attachSchema(BoardSchema);












