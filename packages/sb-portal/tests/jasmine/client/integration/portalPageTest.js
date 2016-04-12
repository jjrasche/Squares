/*
    couldn't find a way to run asyn call to login inside it tests so broke
    users out in separate describe statements.
*/


/*    PROBLEMS
  double call of 'resetTestingEnvironment' likely due to something like
    https://github.com/meteor/meteor/issues/4263
    - separating clearDB and initializeData functions 'fixed'


*/


describe("portal page UI tests", function() {
  // reset DB
  beforeAll(function(done) {
    Meteor.call('resetTestingEnvironment', 'portalTestPage.js', function(err, res) {
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
    var user = SB.fixture.tester2;
    Meteor.loginWithPassword(user.email, user.password, function(err){
      console.log('1');
      Router.go('sbPortalMainPage');
      Tracker.afterFlush(done);
      done();
    });
  });
  beforeAll(waitForRouter);


  it("user tied to 0 boards displays no usersBoard", function(done) {
    console.log($('.sbPortalUsersBoard').length, SB.User.user().username);
    expect($('.sbPortalUsersBoard').length).toEqual(0);
    done();
  });

  it("creating a board adds it to usersBoardList", function(done) {
    var userID = SB.User.findOne({username : SB.fixture.tester2.username})._id;
    Meteor.call('createBoard', 'tester2\'s board', userID, function(err, res){
      console.log($('.sbPortalUsersBoard').length, SB.User.user().username);
      expect($('.sbPortalUsersBoard').length).toEqual(1);
      Tracker.afterFlush(done);
    });
  });


  it("creating a board adds it to usersBoardList", function(done) {
    var userID = SB.User.findOne({username : SB.fixture.tester2.username})._id;
    Meteor.call('createBoard', 'no more boards', userID, function(err, res){
      console.log($('.sbPortalUsersBoard').length, SB.User.user().username);
      expect($('.sbPortalUsersBoard').length).toEqual(2);
      Tracker.afterFlush(done);
    });
  });
}); 