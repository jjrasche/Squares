 /*
    To enforce atomic commits, will compile changes in <set>
    and commit them all at once. Still updating board object, 
    because need to do validation on it when all changes complete.
  */
_.extend(SB.Board.model.prototype, {
  modifySquares : function modifySquares(userID, squares, callback) {
    try {
      callback = setGenericCallbackIfUndefined(callback, 'modifySquares');
      Meteor.call('modifySquares', this._id, userID, squares, callback);
    }
    catch (ex) {
      SB.handleClientError(ex)
    }
  },
  lock : function lock(callback) {
    callback = setGenericCallbackIfUndefined(callback, 'lock');
    Meteor.call('lock', this._id, callback);
  }, 
  invitePlayer : function invitePlayer(email, username, squares, callback) {
    callback = setGenericCallbackIfUndefined(callback, 'invitePlayer');
    Meteor.call('invitePlayer', this._id, SB.User.ID(), email, username, squares, callback);
  },
  updateMembers : function updateMembers(memberID, modifier, callback) {
    callback = setGenericCallbackIfUndefined(callback, 'updateMembers');
    Meteor.call('updateMembers', this._id, memberID, modifier, callback);
  },
  canModifySquare : function canModifySquare(user, x, y) {
    var square = this.getSquare(x,y);
    if (this.locked) 
      throw new Meteor.Error("board is locked, must unlock to make changes");
    // owners have permission to remove/add any member anywhere on board
    if (this.isOwner(user)) {
      return true;
    }
    else {  // non-owners can remove self from squares and add self to empty squares
      var numMemberFreeSquares = this.memberNumFreeSquares(user)
      // choosing empty square and have enough freeSquares
      if (square == SB.Board.const.SQUARE_EMPTY_VALUE) {
        if (numMemberFreeSquares > 0) 
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


var setGenericCallbackIfUndefined = function setGenericCallbackIfUndefined(callback, func) {
  if (!callback) {
    return function(err, res) {
        console.log(func + ": ", err, res);
        if (err) SB.handleServerError(err);
      }

  }
  else return callback;
}