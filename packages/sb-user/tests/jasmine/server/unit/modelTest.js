describe("User model functionality Server", function() {
    beforeAll(function(done) {
      Meteor.call('resetTestingEnvironment', 'userClientModelTests.js', function(err, res) {
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

  it("getUser baisc query selector works", function(done) {
    var baseUser = Meteor.users.findOne()
    var sbUser = SB.User.findOne({username: baseUser.username});
    expect(baseUser._id).toEqual(sbUser._id);
    done();
  });

  it("invalid data returns nothing", function(done) {
    var sbUser = SB.User.findOne({username: 'notAValidName'});
    expect(sbUser).toBeUndefined();
    done();
  });

  it("empty query returns something", function(done) {
    var sbUser = SB.User.findOne();
    if (Meteor.users.find().count()) expect(sbUser).toBeDefined();
    else expect(sbUser).toBeUndefined();
    done();
  });     

  it("getUser transform works", function(done) {
    var sbUser = SB.User.findOne();
    expect(sbUser.boards).toBeDefined();
    done();
  });



  it("getUsers baisc query selector works", function(done) {
    var baseUser = Meteor.users.findOne()
    // if (!baseUser) throw Meteor.Error('no users');  // not apart of test
    var sbUser = SB.User.find({username: baseUser.username}).fetch()[0];
    expect(baseUser._id).toEqual(sbUser._id);
    done();
  });

  it("getUsers sort argument works", function(done) {
    var sbUsers = SB.User.find({}, {username: -1}).fetch();
    expect(sbUsers[0].username).toBeGreaterThan(sbUsers[1].username);

    sbUsers = SB.User.find({}, {username: 1}).fetch();
    expect(sbUsers[1].username).toBeGreaterThan(sbUsers[0].username);

    done();
  });  

  it("getUser transform works", function(done) {
    var sbUser = SB.User.find({}, {limit: 1}).fetch()[0];
    expect(sbUser.boards).toBeDefined();
    done();
  });

  // can't call Meteor.user outside Meteor.method or publish call  
  // may need to find another way to handle this  
  // war4
  // it("SB.User.user works on server", function(done) {
  //   expect(SB.User.user()).toBeUndefined();
  // });

  // it("SB.User.ID works on server", function(done) {
  //   expect(SB.User.ID()).toBeUndefined();
  // });
});







