initializeFixutres = function initializeFixutres() {
	var tester; tester2; board;
	// create users
	if (!SB.User.find().count()) {	
		tester = SB.User.fixture.formObject('test@test.com', 'tester', 'tttttt')
		Accounts.createUser(tester);
		tester = SB.User.findOne();
		if (SB.debug) console.log(tester);

		tester2 = SB.User.fixture.formObject('test2@test.com', 'tester2', 'tttttt')
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