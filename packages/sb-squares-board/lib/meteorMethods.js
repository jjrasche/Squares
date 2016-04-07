HARDCODEDDEFAULTPASSWORD = "squares";


// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	createUserAndInvitation: function(boardID, email, userName, squares) {
		console.log("---- createUserAndInvitation ----");
		console.log("boardID: ", boardID);
		console.log("email: ", email);
		console.log("userName: ", userName);
		console.log("squares: ", squares);

		if (Meteor.isServer) {

			// if no email set a default password for userName login
			var tempPassword = email ? Random.hexString(5) : HARDCODEDDEFAULTPASSWORD;
			console.log("password: ", tempPassword);

			var userObject = {
		        password: tempPassword,
		        profile: {
		          userName: userName,
		          boardIDs: [boardID]
		        },
		        // username: userName
		    };
		    if (email) userObject.email = email;
		    else userObject.username = userName;

		    console.log("userObject: ", userObject);

			var userID = Accounts.createUser(userObject);

		    // console.log("profile2: ", Meteor.users.find(userID).profile);


			Meteor.call('sendInvitation', boardID, userID, squares, tempPassword)
		    return userID; 
		}
	},
	sendInvitation: function(boardID, userID, squares, tempPassword) {
		var board = SB.Board.findOne(boardID);
  		var boardOwner = Meteor.user();
		var user = Meteor.users.findOne(userID);
		var email = user.emails != undefined ? user.emails[0].address : null;

		console.log("---- sendInvitation ----");
		console.log("boardID: ", boardID);
		console.log("userID, email: ", userID, email);
		console.log("squares: ", squares);
		console.log("tempPassword: ", tempPassword);

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
		var board = SB.Board.findOne(boardID);
		var user = Meteor.users.findOne(userID);

		console.log("---- modifyBoard ----");
		console.log("boardID: ", boardID);
		console.log("userID: ", userID);
		console.log("squares: ", squares);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);

		board.modifySquare(user, squares);
	},
	addOwner: function(boardID, userID) {
		var board = SB.Board.findOne(boardID);
		var newOwner = Meteor.users.findOne(userID);

		console.log("---- addOwner ----");
		console.log("boardID: ", boardID);
		console.log("userID: ", userID);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!newOwner) throw new Meteor.Error(INVALID_USER_ERROR);
		if (!board.isOwner(Meteor.user())) throw new Meteor.Error("Only owners can add an owner.");

		// do not add an owner twice
		if (board.isOwner(newOwner))
			return;

		board.owners.push(newOwner._id);
		SB.Board.update({_id: board._id}, {$set: {owners: board.owners}});
		
	},
	createBoard: function(boardName, userID) {
		var user = Meteor.users.findOne(userID);

		console.log("---- createBoard ----");
		console.log("boardName: ", boardName);
		console.log("userID: ", userID);

		if (!user) throw new Meteor.Error(INVALID_USER_ERROR);

		board = {};
		board.owners = [userID];
		board.name = boardName;
		board.members = [{
			_id: userID,
			numSquares: 0,
			paid: false
		}];
		board.locked = false;
		var boardID = SB.Board.insert(board);

		// add board to user's boardIDs
		var boardIDs = user.profile.boardIDs; 
		boardIDs.push(boardID);
		Meteor.users.update(user._id, {$set: {'profile.boardIDs': boardIDs}});

		return boardID;
	},
	randomizeBoardNumbers: function(boardID) {
		var board = SB.Board.findOne(boardID);

		console.log("---- randomizeBoardNumbers ----");
		console.log("boardID: ", boardID);

		if (!Meteor.user())	throw new Meteor.Error(NOT_LOGGED_IN_ERROR);
		if (!board) throw new Meteor.Error(INVALID_BOARD_ERROR);
		if (!board.isOwner(Meteor.user())) throw new Meteor.Error("Only owners can add an owner.");

		if (!board.locked) {
			SB.Board.update({_id: boardID},{$set: {
					winnerNumbers: shuffle([0,1,2,3,4,5,6,7,8,9]),
					loserNumbers: shuffle([0,1,2,3,4,5,6,7,8,9]),	
					locked: true			
				}
			});
		}
		else {
			SB.Board.update({_id: boardID},{$set: {
					winnerNumbers: null,
					loserNumbers: null,	
					locked: false			
				}
			});
		}
	}
})











