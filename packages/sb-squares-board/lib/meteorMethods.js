HARDCODEDDEFAULTPASSWORD = "squares";


// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	createUserAndInvitation: function createUserAndInvitation(boardID, email, username, squares) {
		if (SB.debug) {
			console.log("---- createUserAndInvitation ----");
			console.log("boardID: ", boardID);
			console.log("email: ", email);
			console.log("userName: ", username);
			console.log("squares: ", squares);
		}

		if (Meteor.isServer) {
			// if no email set a default password for userName login
			var tempPassword = email ? Random.hexString(5) : HARDCODEDDEFAULTPASSWORD;
			var userObject = {
		        password: tempPassword,
		        profile: {
		          boardIDs: [boardID]
		        },
		        username: username
		    };
		    if (email) userObject.email = email;
		    else userObject.username = username;

			var userID = Accounts.createUser(userObject);
			Meteor.call('sendInvitation', boardID, userID, squares, tempPassword)
		    return userID; 
		}
	},
	sendInvitation: function sendInvitation(boardID, userID, squares, tempPassword) {
		var board = SB.Board.findOne(boardID);
  		var boardOwner = SB.User.user();
		var user = SB.User.findOne(userID);
		var email = user.emails != undefined ? user.emails[0].address : null;

		if (SB.debug) {
			console.log("---- sendInvitation ----");
			console.log("boardID: ", boardID);
			console.log("userID, email: ", userID, email);
			console.log("squares: ", squares);
			console.log("tempPassword: ", tempPassword);
		}
		if (!SB.User.user())	throw new SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) throw new SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!user) throw new SB.Error(SB.ErrMsg.INVALID_USER_ERROR);
		if (!boardOwner) throw new SB.Error(SB.ErrMsg.INVALID_BOARD_OWNER_ERROR);


		if (Meteor.isServer) {
			if (email) {
				SSR.compileTemplate('invitationEmailHTML', Assets.getText( 'invitationEmail.html' ) );
				var emailData = {
					email: email,
					password: tempPassword,
					userName: user.username,
					boardName: board.name ? board.name : 'boardName',
					numSquares: squares.length,
					boardOwner: boardOwner.username ? boardOwner.username : 'boardOwner',
				};

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
	modifySquares: function modifySquares(boardID, userID, squares) {
		var set = {};
		var board = SB.Board.findOne(boardID);
		var newOwner = SB.User.findOne(userID);

		if (SB.debug) {
			console.log("---- modifySquares ----");
			console.log("board: ", board ? board._id : board);
			console.log("newOwner ", newOwner ? newOwner._id : newOwner);
			console.log("squares: ", squares);
		}
		if (!SB.User.user()) SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!newOwner) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);

		// if user not in board members, add her
		if (!board.member(newOwner)) {
			var member = {
				_id: newOwner._id,
				numSquares: squares.length,
				paid: false       
			}
			board.members.push(member);
			set.members = board.members;
		}

		// action logic, create update package
		for (var i = 0; i < squares.length; i++) {
			var x = squares[i].x; 
			var y = squares[i].y;
			if (!board.canModifySquare(newOwner, x, y))
				throw new SB.Error("you do not have permission to change square (" + x + "," + y + ")");
			if (board.memberOccupiesSquare(newOwner, x, y)) {
				releaseSquare(x, y);
			}else if (board.squareOccupied(x, y)) {
				releaseSquare(x, y);
				takeSquare(newOwner, x, y);
			} else {
				takeSquare(newOwner, x, y);
			}
		}

		// if action gives user more squares than originally had, increase user's squares
		var newNumSquares = board.memberOccupiedSquares(newOwner).length;
		if (board.memberNumSquares(newOwner) < newNumSquares) {
			board.members = board.members.map(function(m) {
				if (m._id == newOwner._id) m.numSquares = newNumSquares;
					return m; 
			});
			set.members = board.members;
		}

		if (SB.debug) console.log('updating board: ', set);
		SB.Board.update({_id: board._id}, {$set: set}, function(err, res) {
			if (SB.debug) console.log('SB.Board.update: ', err, res, board._id);
			return res;
		});


		function releaseSquare(x, y) {
		changeSquare(x, y, SB.Board.const.SQUARE_EMPTY_VALUE);
		}
		function takeSquare(newOwner, x, y) {
		changeSquare(x, y, newOwner._id);
		}
		function changeSquare(x, y, val) {
		var key = SB.Board.getSquareKey(x, y);
		board[key] = set[key] = val
		}	
	},
	addOwner: function addOwner(boardID, userID) {
		var board = SB.Board.findOne(boardID);
		var newOwner = SB.User.findOne(userID);

		if (SB.debug) {
			console.log("---- addOwner ----");
			console.log("boardID: ", boardID);
			console.log("userID: ", userID);
		}
		if (!SB.User.user())	throw new SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) throw new SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!newOwner) throw new SB.Error(SB.ErrMsg.INVALID_USER_ERROR);
		if (!board.isOwner(SB.User.user())) throw new SB.Error("Only owners can add an owner.");

		// do not add an owner twice
		if (board.isOwner(newOwner))
			return;

		board.owners.push(newOwner._id);
		SB.Board.update({_id: board._id}, {$set: {owners: board.owners}});
		
	},
	lock: function lock(boardID) {
		var board = SB.Board.findOne(boardID);

		if (SB.debug) {
			console.log("---- randomizeBoardNumbers ----");
			console.log("boardID: ", boardID);
		}
		if (!SB.User.user())	throw new SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) throw new SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!board.isOwner(SB.User.user())) throw new SB.Error("Only owners can add an owner.");

		if (!board.locked) {
			SB.Board.update({_id: boardID},{$set: {
					winnerNumbers: [0,1,2,3,4,5,6,7,8,9].shuffle(),
					loserNumbers: [0,1,2,3,4,5,6,7,8,9].shuffle(),
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











