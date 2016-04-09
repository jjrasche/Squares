describe("User model functionality Client", function() {
  Meteor.call('resetTestingEnvironment');

  it("SB.User.user works on client", function(done) {
    expect(SB.User.user()).toBeUndefined();

    var user = SB.fixture.tester;
    Meteor.loginWithPassword(user.email, user.password, function(err){
      expect(SB.User.user()).toBeDefined();
      done();
    });
  });

});

