describe("User model functionality Client", function() {
    beforeAll(function(done) {
      Meteor.call('resetTestingEnvironment', 'userServerModelTests.js', function(err, res) {
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

	it("SB.User.user works on client", function(done) {
		expect(SB.User.user()).toEqual(null);
		var user = SB.fixture.tester;
		Meteor.loginWithPassword(user.email, user.password, function(err){
			expect(SB.User.user()).toBeDefined();
      expect(SB.User.ID()).toBeDefined();      
			done();
	  });
	});

});

