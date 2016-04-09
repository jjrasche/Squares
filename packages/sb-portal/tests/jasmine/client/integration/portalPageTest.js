describe("portal page interaction tests", function() {
  var email = "test@test.com"; username = 'tester'; password = 'tttttt';
  Meteor.call('resetTestingEnvironment');
  

  beforeEach(function (done) {
    Meteor.loginWithPassword(email, password, function(err){
      Router.go('sbPortalMainPage');
      Tracker.afterFlush(done);
    });
  });
  beforeEach(waitForRouter);

  // afterEach(function(done){
  //   Meteor.logout(function() {
  //     done();
  //   });
  // });

  it("user should display only one board", function(done) {
    expect($('.sbPortalBoard').length).toEqual(1)
    done();
  });

});

/*
  velocity reporter does not display when process.env.IS_MIRROR == true

*/