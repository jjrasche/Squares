describe("test functionality related to User model", function() {
  Meteor.call('resetTestingEnvironment');
  var baseUser = Meteor.users.findOne();
  if (!baseUser) throw Meteor.Error('no users');

  it("getUser baseline", function(done) {
    var sbUser = SB.User.getUser({username: baseUser.username});
    expect(baseUser._id).toEqual(sbUser._id);
    done();
  });

  it("getUser transform works", function(done) {
    var sbUser = SB.User.getUser({username: baseUser.username});
    expect(sbUser.boards).toBeDefined();
    done();
  });

});

/*
  velocity reporter does not display when process.env.IS_MIRROR == true

*/