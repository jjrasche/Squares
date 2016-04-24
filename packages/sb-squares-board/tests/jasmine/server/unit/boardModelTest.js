describe("BoardModelTest", function() {
  // test initial state of board
  describe("new board state", function() {
    beforeAll(function(done) {
      Meteor.call('resetTestingEnvironment', 'boardModelTests.js', function(err, res) {
        console.log('resetTestingEnvironment: ', err, res);
        done();
      });
    });
    beforeAll(function(done) {
      Meteor.call('initializeFixutres', function(err, res) {
        console.log('initializeFixutres: ', err, res);
        done();
      });
    });
    var board, owner;
    beforeAll(function(done) {
      var user = SB.User.findOne({username: SB.fixture.tester2.username});
      Meteor.call('createBoard', 'initializedBoard', user._id, function(err, res){
        board = SB.Board.findOne(res);
        owner = SB.User.findOne(board.owners[0]);
        done();
      });
    });

    // this first spec waits for beforeAlls to run and only then are fixtures ready.
    it('no squares committed', function() {
      expect(board.numUnCommittedSquares()).toEqual(SB.Board.const.NUM_SQUARES)
    });

    it('only one member', function() {
      expect(board.members.length).toEqual(1)
    });

    it('only one owner', function() {
      expect(board.owners.length).toEqual(1)
    });

    it('member has no winnings', function() {
      expect(board.memberWinnings(owner)).toEqual(0);
    });    
    
    it('member has no squares assigned', function() {
      expect(board.memberNumFreeSquares(owner)).toEqual(0);
    });   

  });
});








