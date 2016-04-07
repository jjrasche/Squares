initializeFixutres = function initializeFixutres() {
	// create users
	var tester = formUserObject('test@test.com', 'tester', 'tttttt')
	Meteor.call('createSBUser',tester , function (err, res) {
		if (!err) tester = Meteor.users.findOne(res);
		else console.log(err);
	});
	console.log(tester);

	var tester2 = formUserObject('test2@test.com', 'tester2', 'tttttt')
	Meteor.call('createSBUser',tester2 , function (err, res) {
		if (!err) tester2 = Meteor.users.findOne(res);
		else console.log(err);		
	});
	console.log(tester2);

	// create board
	var board;
	Meteor.call('createBoard', 'testBoard', tester._id, function(err, res) {
		if (!err) board = SB.Board.findOne(res);
		else console.log(err);
	});
	console.log(board);


}


var formUserObject = function formUserObject(email, userName, password) {
	return {
			email: email, 
			username: userName,
			profile: {
				userName: userName
			},
			password: password
	}
}