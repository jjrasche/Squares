describe("portal page interaction tests", function() {
  console.log('testing', Accounts);
  var email = "test@test.com"; username = 'tester'; password = 'tttttt';
  Meteor.call('resetTestingEnvironment');
  
  //Meteor.call('createUser', {email: email, username: username, password: password});

  // beforeEach(function (done) {
  //   Meteor.loginWithPassword(email, password, function(err){
  //     Router.go('portal');
  //     Tracker.afterFlush(done);
  //   });
  // });
  // beforeEach(function (done) {
  //   Router.go('portal');
  //   Tracker.afterFlush(function(){
  //     done();
  //   });
  // });
  // beforeEach(waitForRouter);

  // // afterEach(function(done){
  // //   Meteor.logout(function() {
  // //     done();
  // //   });
  // // });

  // it("show user's boards when logged in", function(done) {
  //   expect($('.sbPortalBoards').length).toBeGreaterThan(0)
  //   done();
  // });
});