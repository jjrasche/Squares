/*
	TODO
	- action logic 
	- 
*/

// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	createUserAndInvitation: function(boardID, email, userName, squares) {
		console.log("createUserAndInvitation  boardID, email, userName, squares:", boardID, email, userName, squares);
		if (Meteor.isServer) {
			var tempPassword = Random.hexString(5);
			var userID = Accounts.createUser({
		        email: email,
		        password: tempPassword,
		        profile: {
		          userName: userName
		        },
		        username: userName
		    });


		    var profile = Meteor.users.findOne(userID).profile;
		    console.log("profile1: ", profile);
		    profile.boardIDs.push(boardID);
		    var set = {profile: profile};
		    console.log("createUserAndInvitation: ", userID, set);
		
		   	Meteor.users.update({_id: userID}, {$set: set});
		    console.log("profile2: ", Meteor.users.find(userID).profile);


			Meteor.call('sendInvitation', boardID, userID, squares, tempPassword)

		    return userID; 
		}
	},
	sendInvitation: function(boardID, userID, squares, tempPassword) {
		var board = Board.findOne(boardID);
  		var boardOwner = Meteor.user();
		var user = Meteor.users.findOne(userID);
		var email = user.emails != undefined ? user.emails[0].address : null;
		console.log("sendInvitation  boardID, userID, squares, email: ", boardID, userID, squares, email);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);
		if (!boardOwner) throw new Meteor.Error(INVALID_BOARD_OWNER_ERROR);


		if (Meteor.isServer) {
			if (email) {
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
			}
			Meteor.call('modifyBoard', boardID, userID, squares, function(err, res) {
				if (err) 
					throw err;
			});
		}
	},
	modifyBoard: function(boardID, userID, squares) {
		var board = Board.findOne(boardID);
		var user = Meteor.users.findOne(userID);
		console.log("modifyBoard  boardID, userID, squares: ", boardID, userID, squares);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);

		modifySquare(board, user, squares);
	},
	addOwner: function(boardID, userID) {
		var board = Board.findOne(boardID);
		var newOwner = Meteor.users.findOne(userID);
		console.log("addOwner  boardID, userID: ", boardID, userID);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!newOwner) throw new Meteor.Error(INVALID_USER_ERROR);
		if (!isOwner(board, Meteor.user())) throw new Meteor.Error("Only owners can add an owner.");

		// do not add an owner twice
		if (isOwner(board, newOwner))
			return;

		board.owners.push(newOwner._id);
		Board.update({_id: board._id}, {$set: {owners: board.owners}});
		
	},
	createBoard: function(name) {
		console.log("createBoard: ", name);
		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);

		var user = Meteor.user();
		var board = initializeBoard();
		board.owners = [user._id];
		board.name = name;
		board.members = [{
			_id: user._id,
			numSquares: 0,
			paid: false
		}];
		board.locked = false;
		var boardID = Board.insert(board);

		// add board to user's boardIDs
		var boardIDs = Meteor.user().profile.boardIDs; 
		boardIDs.push(boardID);
		Meteor.users.update(Meteor.userId(), {$set: {'profile.boardIDs': boardIDs}});

		return boardID;
	},
	randomizeBoardNumbers: function(boardID) {
		var board = Board.findOne(boardID);
		console.log("randomizeBoardNumbers  boardID: ", boardID);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!isOwner(board, Meteor.user())) throw new Meteor.Error("Only owners can add an owner.");

		if (!board.locked) {
			Board.update({_id: boardID},{$set: {
					winnerNumbers: shuffle([0,1,2,3,4,5,6,7,8,9]),
					loserNumbers: shuffle([0,1,2,3,4,5,6,7,8,9]),	
					locked: true			
				}
			});
		}
		else {
			Board.update({_id: boardID},{$set: {
					winnerNumbers: null,
					loserNumbers: null,	
					locked: false			
				}
			});
		}
	}
})











