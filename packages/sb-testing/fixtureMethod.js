var Future = Npm.require("fibers/future");


var clearDB = function clearDB(){
  console.log('Clear DB');

  var future = new Future();
  var collectionsRemoved = 0;
  var db = Meteor.users.find()._mongo.db;
  db.collections(function (err, collections) {

    // Filter out velocity and system.indexes from collections
    var appCollections = _.reject(collections, function (col) {
      return col.collectionName.indexOf('velocity') === 0 ||
        col.collectionName === 'system.indexes'
        // || col.collectionName === 'users';
    });

    // Remove each collection
    _.each(appCollections, function (appCollection, idx) {
      appCollection.remove(function (e) {
        if (e) {
          console.error('Failed removing collection', e);
          fut.return('fail: ' + e);
        }
        collectionsRemoved++;
        console.log('Removed collection: ', appCollection.collectionName, idx);
        if (idx+1 === appCollections.length) future.return();
        if (appCollections.length === collectionsRemoved) {
          // console.log('Finished resetting database');
        }
      });
    });
  });
  future.wait();
  console.log('Finished clearing');
}


var resetTestingEnvironment = function resetTestingEnvironment(calledFrom) {
  console.log('resetTestingEnvironment called from: ' + calledFrom);
  if (process.env.VELOCITY_TEST_PACKAGES) {
    clearDB();
  } else {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'resetTestingEnvironment can only be executed in a Velocity mirror.'
    );
  }
};


var initializeFixutres = function initializeFixutres() {
  var tester; tester2; board;

  // create users
  if (!SB.User.find().count()) {  
    tester = SB.User.fixture.formObject(SB.fixture.tester);
    Accounts.createUser(tester);
    tester = SB.User.findOne();
    if (SB.debug) console.log(tester);

    tester2 = SB.User.fixture.formObject(SB.fixture.tester2);
    Accounts.createUser(tester2);
    if (SB.debug) console.log(tester2);
  }

  // create board
  var future = new Future();
  if (!SB.Board.find().count()) {
    var boardCreatedFuture = new Future();
    Meteor.call('createBoard', 'testBoard', tester._id, function(err, res) {
      if (!err) board = SB.Board.findOne(res);
      else console.log(err);
      boardCreatedFuture.return();
    });
    boardCreatedFuture.wait();

    // add tester3 to the board 
    var invitee = SB.fixture.tester3;
    Meteor.call('invitePlayer', board._id, board.owners[0], invitee.email, invitee.username, [{x:1, y:8}], function(err, res) {
      invitee = SB.User.findOne({username: invitee.username});
      if (err) console.log('fixture invitePlayer: ', err.stack)
      future.return();
    });

    if (SB.debug) console.log(board);
  }

  // create games
  if (!SB.Game.find().count()) {
    var games = [];
    for (var i = 0; i < 64; i++) {
      var gameID = SB.Game.insert(SB.Game.fixture.randomGame());
      if (gameID) games.push(SB.Game.findOne(gameID));
    }
    if (SB.debug) console.log(games[0]);
  }
  // future.wait();
}

Meteor.methods({
  resetTestingEnvironment: resetTestingEnvironment,
  initializeFixutres: initializeFixutres
});