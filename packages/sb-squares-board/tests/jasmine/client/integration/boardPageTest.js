/*
    couldn't find a way to run asyn call to login inside it tests so broke
    users out in separate describe statements.
*/


/*    PROBLEMS
  double call of 'resetTestingEnvironment' likely due to something like
    https://github.com/meteor/meteor/issues/4263
    - separating clearDB and initializeData functions 'fixed'


*/


describe("Board page UI tests", function() {
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
    var user = SB.fixture.tester;
    Meteor.loginWithPassword(user.email, user.password, function(err){
      var board = SB.User.user().boards()[0];

      console.log('1: ', board, SB.User.user());
      Router.go('sbSquaresBoardPage', board._id);
      Tracker.afterFlush(done);
      done();
    });
  });
  beforeAll(waitForRouter);


  it("simple", function(done) {
    console.log(testing);
    //expect($('.sbPortalUsersBoard').length).toEqual(0);
    except(0).toEqual(1);
    done();
  });

}); 