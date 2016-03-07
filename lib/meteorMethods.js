/*
	TODO
	- action logic 
	- 
*/

// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	createUserAndInvitation: function(boardID, email, userName, squares) {
		console.log("boardID, email, userName, squares: ", boardID, email, userName, squares);
		if (Meteor.isServer) {
			var tempPassword = Random.hexString(5);
			var userID = Accounts.createUser({
		        email: email,
		        password: tempPassword,
		        profile: {
		          userName: userName
		        }
		    });
		    console.log("createUserAndInvitation: ", userID);
		   	Meteor.users.update(userID,
		   		{$set: {
		   			boards: [{
			          _id: boardID
			        }]}
			    });
			Meteor.call('sendInvitation', boardID, userID, squares, tempPassword)

		    return userID; 
		}
	},
	sendInvitation: function(boardID, userID, squares, tempPassword) {
		var board = Board.findOne(boardID);
  		var boardOwner = Meteor.users.findOne({_id: board.owner});
		var user = Meteor.users.findOne(userID);
		var email = user.emails[0].address;
		console.log("boardID, userID, squares, email: ", boardID, userID, squares, email);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);
		if (!boardOwner) throw new Meteor.Error(INVALID_BOARD_OWNER_ERROR);


		if (Meteor.isServer) {
			SSR.compileTemplate('invitationEmailHTML', Assets.getText( 'invitationEmail.html' ) );
			var emailData = {
				email: email,
				password: tempPassword,
				userName: user.profile.userName,
				boardName: board.name ? board.name : 'boardName',
				numSquares: squares.length,
				boardOwner: boardOwner.profile.userName ? boardOwner.profile.userName : 'boardOwner',
			};
			console.log('emailData: ', emailData);
			console.log('email render: ', SSR.render('invitationEmailHTML', emailData))

			// try to send invitation
			Email.send({
		      to: email,
		      from: "squares@webhop.me",
		      subject: "NCAA squares invitation",
		      html: SSR.render('invitationEmailHTML', emailData)
		    })


			Meteor.call('modifyBoard', boardID, userID, squares, function(err, res) {
				if (err) 
					throw err;
			});

		}
	},
	/*
	*/
	modifyBoard: function(boardID, userID, squares) {
		var board = Board.findOne(boardID);
		var user = Meteor.users.findOne(userID);
		console.log("boardID, userID, squares: ", boardID, userID, squares);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);

		modifySquare(board, user, squares);
	},
	createBoard: function(name) {
		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);

		var user = Meteor.user();
		var board = initializeBoard();
		board.owner = user._id;
		board.name = name;
		board.members = [{
			_id: user._id,
			numSquares: 0
		}];
		board.locked = false;

		var boardID = Board.insert(board);
		return boardID;
	}
})