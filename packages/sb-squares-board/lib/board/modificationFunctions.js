 /*
    To enforce atomic commits, will compile changes in <set>
    and commit them all at once. Still updating board object, 
    because need to do validation on it when all changes complete.
  */
_.extend(SB.Board.model.prototype, {
  modifySquares : function modifySquares(userID, squares) {
    try {
      Meteor.call('modifySquares', this._id, SB.User.ID(), squares, 
        function(err, res) {
          // console.log("clicked square: ", err, res);
          if (err) SB.handleServerError(err);
        }
      );
    }
    catch (ex) {
      SB.handleClientError(ex)
    }
  },
  lock : function lock() {
    
  }, 

  canModifySquare : function canModifySquare(user, x, y) {
    // console.log('canModifySquare: ', this);
    var square = this.getSquare(x,y);
    if (this.locked) 
      throw new Meteor.Error("board is locked, must unlock to make changes");
    // owners have permission to remove/add any member anywhere on board
    if (this.isOwner(user)) {
      return true;
    }
    // non-owners can remove self from squares and add self to empty squares
    else {
      var numFreeSquares = this.memberFreeSquares(user)
      // choosing empty square and have enough freeSquares
      if (square == SB.Board.const.SQUARE_EMPTY_VALUE) {
        if (numFreeSquares > 0) 
          return true;
        else 
          throw new Meteor.Error("All " + this.memberNumSquares(user) +
                      " of your squares are on the board. Remove an" +
                      " existing one, or contact board owner to select" +
                      " this square");
      }
      if (square == user._id)
        return true;
      else 
        throw new Meteor.Error("Cannot remove other player's squares." +
                     " Only the board owner has permission to do this.");
    }
  }
});