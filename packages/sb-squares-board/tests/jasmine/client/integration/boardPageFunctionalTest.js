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
    var squares = [{x: 1, y: 1}, {x: 1, y: 2}];

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


  it('Invite an existing user board member', function(done) {
    var invitee = SB.fixture.tester2;
    var user = SB.User.user();
    var board = user.boards()[0];
    var squares = [{x: 2, y: 2}, {x: 0, y: 9}];

    // add member
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

  var newUser = {email:'test4@test.com', username:'tester4', password:'tttttt'};
  it('Invite an new user board member by email', function(done) {
    var owner = SB.User.user();
    var board = owner.boards()[0];
    var squares = [{x: 9, y: 9}];

    // add member without giving any squares
    board.invitePlayer(newUser.email, newUser.username, squares, function(err, res) {
      board = owner.boards()[0];
      newUser = SB.User.findOne({username: newUser.username});

      expect(newUser).toBeDefined();
      expect(err).toBeUndefined();

      expect(board.memberNumSquares(newUser)).toEqual(squares.length);
      expect(board.member(newUser)).toBeTruthy(); 
      for (var i = 0; i < squares.length; i++) {
        var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
        expect(board[squareKey]).toEqual(newUser._id);
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

  it('owner unable to assign more squares than exist', function(done) {
    console.log('owner unable to assign more squares than exist');
    var owner = SB.User.user();
    var invitee = SB.User.findOne({username: SB.fixture.tester2.username});
    var board = owner.boards()[0];
    var origOwnerNumSquares = board.memberNumSquares(owner);
    var origInviteeNumSquares = board.memberNumSquares(invitee);
    var squares = [];
    for (var x = 0; x < 10; x++) {
      for (var y = 0; y < 10; y++) {
        squares.push({x:x, y:y});
      }
    }

    board.modifySquares(owner._id, squares, function(err, res) {
      board = owner.boards()[0];
      console.log('owner unable to assign more squares than exist: ', err);
      expect(err).toBeDefined();
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
      console.log('non-owner cannot take non-empty square');
      var user = SB.User.user();
      var board = user.boards()[0];
      var origUserNumSquares = board.memberNumSquares(user);
      var squares = [{x: 2, y: 2}];

      // add member without giving any squares
      board.modifySquares(user._id, squares, function(err, res) {
        expect(err).toBeDefined();
        // didn't add any squares
        expect(board.memberNumSquares(user)).toEqual(origUserNumSquares);
        for (var i = 0; i < squares.length; i++) {
          var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
          expect(board[squareKey]).not.toEqual(user._id);
        }        
      
        done();
      });
    });  
  
    it('non-owner can take empty square', function(done) {
      var user = SB.User.user();
      var board = user.boards()[0];
      var origUserNumSquares = board.memberNumSquares(user);
      var squares = [{x: 1, y: 1}];
      // add member without giving any squares
      board.modifySquares(user._id, squares, function(err, res) {
        board = user.boards()[0];
        expect(err).toBeUndefined();

        // should not get more squares than originally started with
        expect(board.memberNumSquares(user)).toEqual(origUserNumSquares);
        for (var i = 0; i < squares.length; i++) {
          var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
          expect(board[squareKey]).toEqual(user._id);
        }
        done();
      });
    });

    it('non-owner can remove own square', function(done) {
      console.log('non-owner can remove own square');
      var user = SB.User.user();
      var board = user.boards()[0];
      var origUserNumSquares = board.memberNumSquares(user);
      var squares = [{x: 1, y: 1}];
      // add member without giving any squares
      board.modifySquares(user._id, squares, function(err, res) {
        board = user.boards()[0];
        expect(err).toBeUndefined();

        // should not get more squares than originally started with
        expect(board.memberNumSquares(user)).toEqual(origUserNumSquares);
        for (var i = 0; i < squares.length; i++) {
          var squareKey = SB.Board.getSquareKey(squares[i].x, squares[i].y);
          expect(board[squareKey]).toEqual(SB.Board.const.SQUARE_EMPTY_VALUE);
        }
        done();
      });
    });      
  });


  describe('prevent logic', function() {
    // login as non-owner
    beforeAll(function (done) {
      var user = SB.fixture.tester;
      Meteor.loginWithPassword(user.email, user.password, function(err){
        Router.go('sbSquaresBoardPage', {_id: SB.User.user().profile.boardIDs[0]});
        Tracker.afterFlush(done);
        done();
      });
    });
    beforeAll(waitForRouter);

    it('able to lock board', function(done) {
      console.log('able to lock board');
      var owner = SB.User.user();
      var board = owner.boards()[0];

      board.lock(function(err, res) {
        board = owner.boards()[0];
        console.log('lock: ', board, err, res);
        expect(err).toBeUndefined();
        expect(board.winnerNumbers).toBeTruthy();
        expect(board.loserNumbers).toBeTruthy();
        expect(board.locked).toBeTruthy();
        done();
      });
    }); 
  });

}); 


