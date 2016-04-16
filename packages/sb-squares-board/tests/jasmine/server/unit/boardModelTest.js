describe("Board instance methods", function() {
  // // test initial state of board
  // describe("new board state", function() {
  //   beforeAll(function(done) {
  //     Meteor.call('resetTestingEnvironment', 'portalTestPage.js', function(err, res) {
  //       console.log('resetTestingEnvironment: ', err, res);
  //       done();
  //     });
  //   });
  //   beforeAll(function(done) {
  //     Meteor.call('initializeFixutres', function(err, res) {
  //       console.log('initializeFixutres: ', err, res);
  //       done();
  //     });
  //   });

  //   var board = SB.Board.findOne();
  //   var owner = SB.User.findOne(board.owners[0]);

  //   it('no squares committed', function() {
  //     expect(board.numUnCommittedSquares()).toEqual(SB.Board.const.NUM_SQUARES)
  //   });

  //   it('only one member', function() {
  //     expect(board.members.length).toEqual(1)
  //   });

  //   it('only one owner', function() {
  //     expect(board.owners.length).toEqual(1)
  //   });

  //   it('member has no winnings', function() {
  //     expect(board.memberWinnings(owner)).toEqual(0);
  //   });    
    
  //   it('member has no squares assigned', function() {
  //     expect(board.memberFreeSquares(owner)).toEqual(0);
  //   });   

  // });


  // test changing state of board 
  describe("changing board state", function() {
    // beforeAll(function(done) {
    //   Meteor.call('resetTestingEnvironment', 'portalTestPage.js', function(err, res) {
    //     console.log('resetTestingEnvironment: ', err, res);
    //     done();
    //   });
    // });
    // beforeAll(function(done) {
    //   Meteor.call('initializeFixutres', function(err, res) {
    //     console.log('initializeFixutres: ', err, res);
    //     done();
    //   });
    // });

    var board = SB.Board.findOne();
    var owner = SB.User.findOne(board.owners[0]);

    it('assign a square', function() {
      var square = {x: 1, y: 1};
      board.modifySquare(owner, [square]);
      console.log('assign a square: ');
      // add square to boardMemeber
      expect(board.memberNumSquares(owner)).toEqual(1);
      // change squareKey object on document
      var squareKey = SB.Board.getSquareKey(square.x, square.y);
      expect(board[squareKey]).toEqual(owner._id);
    });  

  });


});