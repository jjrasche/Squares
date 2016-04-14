 /*
    To enforce atomic commits, will compile changes in <set>
    and commit them all at once. Still updating board object, 
    because need to do validation on it when all changes complete.
  */
_.extend(SB.Board.model.prototype, {
  modifySquare : function modifySquare(newOwner, squaresToChange) {
    var set = {};

    // if user not in board members, add her
    if (!this.isMember(newOwner)) {
      var member = {
        _id: newOwner._id,
        numSquares: squaresToChange.length,
        paid: false       
      }
      this.members.push(member);
      set.members = this.members;
    }

    for (var i = 0; i < squaresToChange.length; i++) {
      var x = squaresToChange[i].x; 
      var y = squaresToChange[i].y;

      if (!this.canModifySquare(newOwner, x, y))
        throw new Meteor.Error("you do not have permission to change square (" + x + "," + y + ")");

      if (this.memberOccupiesSquare(newOwner, x, y)) {
        releaseSquare(x, y);
      }else if (squareOccupied(x, y)) {
        releaseSquare(x, y);
        takeSquare(newOwner, x, y);
      } else {
        takeSquare(newOwner, x, y);
      }
    }

    // If move gives user more squares than in board.members<user>.numSquares 
    var newNumSquares = this.memberOccupiedSquares(newOwner).length;
    if (this.getBoardMember(newOwner).numSquares < newNumSquares) {
      this.members = this.members.map(function(m) {
        if (m._id == newOwner._id) m.numSquares = newNumSquares;
        return m; 
      });
      set.members = this.members;
    }

    SB.Board.update({_id: this._id}, {$set: set})

    function releaseSquare(x, y) {
      changeSquare(x, y, SB.Board.const.SQUARE_EMPTY_VALUE);
    }
    function takeSquare(newOwner, x, y) {
      changeSquare(x, y, newOwner._id);
    }
    function changeSquare(x, y, val) {
      var key = SB.Board.getSquareKey(x, y);
      this[key] = set[key] = val
    }
  },
  canModifySquare : function canModifySquare(user, x, y) {
    var square = board.getSquare(x,y);
    var user = SB.User.user();

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
      if (square == SB.Board.const.SQUARE_EMPTY_VALUE) {
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
});