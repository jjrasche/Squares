/*
  war8  can't create click event on elements within svg  10 x 10 grid
  
  war5 unable to trigger an enter event for text inputs
  solution:
    $('.memberListName')[0]   === dom element
    $('.memberListName').eq(0) === jquery element
    jquery methods like click(), val(), and trigger() only work on the jquery elements


*/

describe("Board page UI tests", function() {

  describe("owner able to", function() {
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


    describe("edit userNumSquares", function() {
      var numSquares = 4, username;
      beforeAll(function() {
        username = $('.memberListName')[0].textContent;
        SB.testing.enterInput(numSquares, '.memberListNumSquares');
      });
       
      it ("user should now have that many squares", function() {
        var board = SB.Board.findOne();
        var user = SB.User.findOne({username: username});

        expect(Number($('.memberListNumSquares').eq(0).val())).toEqual(numSquares);
        expect(board.memberNumSquares(user)).toEqual(numSquares);
      });

      it("not overallocate squares", function() {
        SB.testing.enterInput(100, '.memberListNumSquares');

        expect(Number($('.memberListNumSquares').eq(0).val())).toEqual(numSquares);
        expect(board.memberNumSquares(user)).toEqual(numSquares);
      });
    });



    describe("edit userPaid", function() {
      var username;
      beforeEach(function() {
        username = $('.memberListName')[0].textContent;
        $('.memberListPaid').eq(0).click();
      });
       
      it ("changing from unchecked to checked", function() {
        var board = SB.Board.findOne();
        var user = SB.User.findOne({username: username});

        expect($('.memberListPaid').eq(0).prop('checked')).toBeTruthy();
        expect(board.memberPaid(user)).toBeTruthy();
      });

      it ("changing from checked to unchecked", function() {
        var board = SB.Board.findOne();
        var user = SB.User.findOne({username: username});

        expect($('.memberListPaid').eq(0).prop('checked')).toBeFalsy();
        expect(board.memberPaid(user)).toBeFalsy();
      });
    });
  });
}); 


