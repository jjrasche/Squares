// var resetDatabase = function resetDatabase() {
//   // safety check
//   if (!process.env.VELOCITY_TEST_PACKAGES) {
//     throw new Meteor.Error(
//       'NOT_ALLOWED',
//       'velocityReset is not allowed outside of a mirror. Something has gone wrong.'
//     );
//   }

//   var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
//   var collections = Meteor.wrapAsync(db.collections, db)();
//   var appCollections = _.reject(collections, function (col) {
//     return col.collectionName.indexOf('velocity') === 0
//         || col.collectionName === 'system.indexes'
//         // || col.collectionName === 'users';
//   });

//   _.each(appCollections, function (appCollection) {
//     console.log('remove ' + appCollection.collectionName);
//     Meteor.wrapAsync(appCollection.remove, appCollection)();
//   });
// };
var clearDB = function clearDB(){
  console.log('Clear DB');

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
    _.each(appCollections, function (appCollection) {
      appCollection.remove(function (e) {
        if (e) {
          console.error('Failed removing collection', e);
          fut.return('fail: ' + e);
        }
        collectionsRemoved++;
        // console.log('Removed collection: ', appCollection.collectionName);
        if (appCollections.length === collectionsRemoved) {
          // console.log('Finished resetting database');
        }
      });
    });
  });
  console.log('Finished clearing');
}


var resetTestingEnvironment = function resetTestingEnvironment(calledFrom) {
  console.log('resetTestingEnvironment called from: ' + calledFrom);
  if (process.env.VELOCITY_TEST_PACKAGES) {
    clearDB();
    console.log('1 done')
    // initializeFixutres();
    console.log('2 done')
  } else {
    throw new Meteor.Error(
      'NOT_ALLOWED',
      'resetTestingEnvironment can only be executed in a Velocity mirror.'
    );
  }
};


sleep = function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

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
  if (!SB.Board.find().count()) {
    Meteor.call('createBoard', 'testBoard', tester._id, function(err, res) {
      if (!err) board = SB.Board.findOne(res);
      else console.log(err);
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
}

Meteor.methods({
  resetTestingEnvironment: resetTestingEnvironment,
  initializeFixutres: initializeFixutres
});