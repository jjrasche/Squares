/*
    couldn't find a way to run asyn call to login inside it tests so broke
    users out in separate describe statements.
*/


/*    PROBLEMS
  double call of 'resetTestingEnvironment' likely due to something like
    https://github.com/meteor/meteor/issues/4263
    - separating clearDB and initializeData functions 'fixed'


*/


describe("Board page funcitonal tests", function() {
  // reset DB
  beforeAll(function(done) {
    Meteor.call('resetTestingEnvironment', 'boardPageFunctionalTest.js', function(err, res) {
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
  beforeAll(function (done) {
    var user = SB.fixture.tester;
    Meteor.loginWithPassword(user.email, user.password, function(err){
      // console.log('loginWithPassword: ', SB.User.user().profile.boardIDs[0]);
      Router.go('sbSquaresBoardPage', {_id: SB.User.user().profile.boardIDs[0]});
      Tracker.afterFlush(done);
      done();
    });
  });
  beforeAll(waitForRouter);


  it('Owner click to take a square', function(done) {
    var user = SB.User.user();
    var board = user.boards()[0];
    var origNumSquares = board.memberNumSquares(user);
    var squares = [{x: 1, y: 1}, {x: 1, y: 2}];
    
    console.log('Owner click to take a square: ', user, board);
    board.modifySquares(user._id, squares, function(err, res) {
      board = user.boards()[0]; // must update board as this is not reactive
      expect(err).toBeUndefined();
      console.log('modifySquares: ', err, res, board);
      
      // verify boardMember has a square
      expect(board.memberNumSquares(user)).toEqual(origNumSquares + squares.length);
      // verify squareKey object on document changed
      for (var i = 0; i < squares.length; i++) {
        var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
        expect(board[squareKey]).toEqual(user._id);
      }
      done();
    });
  });

  it('Owner click to remove a square', function(done) {
    var user = SB.User.user();
    var board = user.boards()[0];
    var origNumSquares = board.memberNumSquares(user);
    var squares = [{x: 1, y: 1}];

    board.modifySquares(user._id, squares, function(err, res) {
      board = user.boards()[0];
      expect(err).toBeUndefined();

      // verify boardMember didn't loose an alloted square by removing one from board
      expect(board.memberNumSquares(user)).toEqual(origNumSquares); 
      // verify squareKey object on document changed to empty
      for (var i = 0; i < squares.length; i++) {
        var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
        expect(board[squareKey]).toEqual(SB.Board.const.SQUARE_EMPTY_VALUE);
      }
      done();
    });
  });  


  it('Invite a board member', function(done) {
    var invitee = SB.fixture.tester2;
    var user = SB.User.user();
    var board = user.boards()[0];
    var squares = [{x: 2, y: 2}];

    // add member without giving any squares
    board.invitePlayer(invitee.email, invitee.username, squares, function(err, res) {
      board = user.boards()[0];
      invitee = SB.User.findOne({username: invitee.username});

      expect(invitee).toBeDefined();
      expect(err).toBeUndefined();

      expect(board.memberNumSquares(invitee)).toEqual(squares.length);
      expect(board.member(invitee)).toBeTruthy(); 
      for (var i = 0; i < squares.length; i++) {
        var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
        expect(board[squareKey]).toEqual(invitee._id);
      }
      done();
    });
  });  

  it('Board owner able to take another player\'s square', function(done) {
    var owner = SB.User.user();
    var invitee = SB.User.findOne({username: SB.fixture.tester2.username});
    var board = owner.boards()[0];
    var origOwnerNumSquares = board.memberNumSquares(owner);
    var origInviteeNumSquares = board.memberNumSquares(invitee);
    var squares = [{x: 2, y: 2}];

    board.modifySquares(owner._id, squares, function(err, res) {
      board = owner.boards()[0];
      expect(err).toBeUndefined();

      // as owner removed 1 square, she has 1 square unclaimed on board to use.
      expect(board.memberNumSquares(owner)).toEqual(origOwnerNumSquares); 
      for (var i = 0; i < squares.length; i++) {
        var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
        expect(board[squareKey]).toEqual(owner._id);
      }

      // invitee should still have access to sameNumber of squars
      expect(board.memberNumSquares(invitee)).toEqual(origInviteeNumSquares);
      done();
    });
  });  



  describe('prevent logic', function() {
    // login as non-owner
    beforeAll(function (done) {
      var user = SB.fixture.tester2;
      Meteor.loginWithPassword(user.email, user.password, function(err){
        // console.log('loginWithPassword: ', SB.User.user().profile.boardIDs[0]);
        Router.go('sbSquaresBoardPage', {_id: SB.User.user().profile.boardIDs[0]});
        Tracker.afterFlush(done);
        done();
      });
    });
    beforeAll(waitForRouter);

    it('non-owner cannot take non-empty square', function(done) {
      var user = SB.User.user();
      var board = user.boards()[0];
      var squares = [{x: 2, y: 2}];

      // add member without giving any squares
      board.modifySquares(user._id, squares, function(err, res) {
        expect(err).toBeDefined();
        done();
      });
    });  
  
    it('non-owner can take empty square', function(done) {
      var user = SB.User.user();
      var board = user.boards()[0];
      var squares = [{x: 1, y: 1}];
      // add member without giving any squares
      board.modifySquares(user._id, squares, function(err, res) {
        board = user.boards()[0];
        expect(err).toBeUndefined();

        // as user removed 1 square, she has 1 square unclaimed on board to use.
        expect(board.memberNumSquares(user)).toEqual(origOwnerNumSquares); 
        for (var i = 0; i < squares.length; i++) {
          var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
          expect(board[squareKey]).toEqual(user._id);
        }
        done();
      });
    });   
  });


  // it("simple", function(done) {
  //   console.log(testing);
  //   //expect($('.sbPortalUsersBoard').length).toEqual(0);
  //   except(0).toEqual(1);
  //   done();
  // });

}); 


