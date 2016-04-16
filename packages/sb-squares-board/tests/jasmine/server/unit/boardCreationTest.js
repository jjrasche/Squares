describe("Board creation", function() {
  // reset DB
  beforeAll(function(done) {
    Meteor.call('resetTestingEnvironment', 'portalTestPage.js', function(err, res) {
      done();
    });
  });
  beforeAll(function(done) {
    Meteor.call('initializeFixutres', function(err, res) {
      console.log('initializeFixutres: ', err, res);
      done();
    });
  });


  it("createBoard called with null params fails", function(done) {
    Meteor.call('createBoard', null, null, function(err, res) {
      expect(err).toBeDefined();
      expect(res).toBeUndefined();
      done();
    })
  });


  it("square property default set to empty", function(done) {
    var board = SB.Board.findOne();
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        var squarekey = SB.Board.getSquareKey(x, y);
        expect(board[squarekey]).toBeDefined();
      }
    }
    done();
  });

  it("creator of board is listed as both member and owner of board", function(done) {
    var user = SB.User.findOne();
    Meteor.call('createBoard', 't1', user._id, function(err, res) {
      var board = SB.Board.findOne(res);
      expect(board.isOwner(user)).toBeTruthy()
      expect(board.member(user)).toBeTruthy()
      done();
    })
  });

  it("creator of board is listed as both member and owner of board", function(done) {
    var user = SB.User.findOne();
    Meteor.call('createBoard', 't2', user._id, function(err, res) {
      var board = SB.Board.findOne(res);
      expect(board.locked).toBeFalsy()
      done();
    })
  });
});














