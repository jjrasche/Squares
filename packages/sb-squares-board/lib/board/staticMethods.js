// static methods
_.extend(SB.Board, {
  initializeBoard : function initializeBoard() {
    var board = {}
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        var key = this.getSquareKey(i,j);
        board[key] = SB.Board.const.SQUARE_EMPTY_VALUE;
      }
    }
    return board;
  },
  getSquareKey : function getSquareKey(x, y) {
    return 'sq'+String(x)+String(y);
  }
});