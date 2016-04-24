HARDCODEDDEFAULTPASSWORD = "squares";
if (Meteor.isServer) {
	Future = Npm.require("fibers/future");
}

/*
	all async calls within an async call should guarentee completement prior to returning
	Note: the invite user chain may take a while, waiting for all these actions to happen
*/
var syncModifySquares = function syncModifySquares(boardID, userID, squares) {
	var future = new Future();
	Meteor.call('modifySquares', boardID, userID, squares, function(err, res) {
		console.log('modifySquares: ', err, res);
		if (!err) future.return(res);
	    else future.throw(err);
	});
	return(future.wait());
}


// edit mode allows owners to select multiple squares and assign them to a single email 
Meteor.methods({
	invitePlayer: function invitePlayer(boardID, ownerID, email, username, squares) {
		var board = SB.Board.findOne(boardID);
		var owner = SB.User.findOne(ownerID);
		if (SB.debug) {
			console.log("---- invitePlayer ----");
			console.log("boardID: ", boardID);
			console.log("ownerID: ", ownerID);
			console.log("email: ", email);
			console.log("userName: ", username);
			console.log("squares: ", squares);
			console.log("---------------------------------");
		}
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!owner) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);

		if (Meteor.isServer) {
		    // if email address is attached to user and user already a member, cannot add
		    var inviteeID = Meteor.call('findUserByEmail', email), invitee;
		    if (inviteeID && board.memberID(inviteeID))
		        throw new Meteor.Error("User already on board, try re-assigning squares");

		    // find or create user
		    if (!inviteeID) {
			    // if no email set a default password for userName login
				var tempPassword = email ? Random.hexString(5) : HARDCODEDDEFAULTPASSWORD;
				var userObject = {
			        password: tempPassword,
			        username: username
			    };
			    if (email) userObject.email = email;
			    inviteeID = Accounts.createUser(userObject);
			    invitee = SB.User.findOne(inviteeID);
			}
		    else invitee = SB.User.findOne(inviteeID);

		    // send email
			if (email) {
				console.log('sendInvitation: ', Assets);
				SSR.compileTemplate('invitationEmailHTML', emailInvitationTemplate);//Assets.getText( '/packages/jjrasche_sb-squares-board/private/invitationEmail.html' ) );
				var emailData = {
					email: email,
					password: tempPassword,
					userName: invitee.username,
					boardName: board.name ? board.name : 'boardName',
					numSquares: squares.length,
					boardOwner: owner.username ? owner.username : 'boardOwner',
				};
				// try to send invitation
				Email.send({
			      to: email,
			      from: "squares@webhop.me",
			      subject: "NCAA squares invitation",
			      html: SSR.render('invitationEmailHTML', emailData)
			    })
			}

			var newBoardIDs = invitee.profile.boardIDs.concat([boardID])
			console.log('newBoardIDs: ', newBoardIDs);
			invitee.update({$set : {'profile.boardIDs' : newBoardIDs}});

			syncModifySquares(boardID, inviteeID, squares);	
		}
	},
	modifySquares: function modifySquares(boardID, userID, squares) {
		var set = {};
		var board = SB.Board.findOne(boardID);
		var newOwner = SB.User.findOne(userID);

		if (SB.debug) {
			console.log("---- modifySquares ----");
			console.log("board: ", board ? board._id : board);
			console.log("newOwner: ", newOwner ? newOwner._id : newOwner);
			console.log("squares: ", squares);
			console.log("---------------------------------");
		}
		// if (!SB.User.user()) SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!newOwner) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);

		console.log('board.member(newOwner): ', board.member(newOwner));
		// if user not in board members, add her
		if (!board.member(newOwner)) {
			var member = {
				_id: newOwner._id,
				numSquares: squares.length,
				paid: false       
			}
			console.log('adding memeber: ', member);
			board.members.push(member);
			set.members = board.members;
		}

		// action logic, create update package
		for (var i = 0; i < squares.length; i++) {
			var x = squares[i].x; 
			var y = squares[i].y;
			if (!board.canModifySquare(newOwner, x, y))
				SB.Error("you do not have permission to change square (" + x + "," + y + ")");
			if (board.memberOccupiesSquare(newOwner, x, y)) {
				releaseSquare(x, y);
			}else if (board.squareOccupied(x, y)) {
				releaseSquare(x, y);
				takeSquare(newOwner, x, y);
			} else {
				takeSquare(newOwner, x, y);
			}
		}

		/*
			---- Compare methods of tracking allotted squares ----
			source of truth of allotted squares:
			1) member's numSquares  ******* 
				Pro:
					- Honors previous square allotments. Forcing owner to manually 
					  change a member's # squares to fix a mistake
				Con: 
					- if a user was mistakenly given more squares than intended,
					  it would be take some research to find who it was and decrease
					  that user's # squares to fix the mistake. A similar maneuver
					  would have to be taken for mistakes with approach 2, just
					  by finding users with unassigned squares.
			2) board
				Pro:
					- Owner has more freedom, but can more easily get into trouble.
				Con: 
					- need a way of keeping total # alloted squares under max 
					  anyways. Scenario: member removes only square to reposition,
					  before the member takes the other square, the owner assigns
					  all remaining squares to another member. Then the first
					  member will have 1 alloted square and no place to put it. 

			Going with approach 1 as it protects the original agreement with member, 
			and prevents the graver more easily compounded mistake of overassigning.
		*/
		// if action gives user more squares than originally had, increase user's squares
		var numMemberSquaresOnBoard = board.memberOccupiedSquares(newOwner).length;
		var numMemberAllocatedSquares = board.memberNumSquares(newOwner);		
		if (numMemberAllocatedSquares < numMemberSquaresOnBoard) {
			board.members = board.members.map(function(m) {
				if (m._id == newOwner._id) m.numSquares = numMemberSquaresOnBoard;
					return m; 
			});
			if (board.overAllocatedSquares()) 
				SB.Error(SB.ErrMsg.OVER_ALLOCATED_SQUARES(board, newOwner));
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
	updateMembers: function updateMembers(boardID, memberID, modifier) {
		var board = SB.Board.findOne(boardID);
		var member = SB.User.findOne(memberID);

		if (SB.debug) {
			console.log("---- updateMembers ----");
			console.log("boardID: ", boardID);
			console.log("memberID: ", memberID);
			console.log("modifier: ", modifier);
			console.log("---------------------------------");
		}
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!member) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);
		if (!member) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);

		board.members = board.members.map(function(m) {
			if (m._id === memberID) {
				return {
					_id : memberID,
					numSquares : modifier.numSquares === undefined ? m.numSquares : modifier.numSquares,
					paid : modifier.paid === undefined ? m.paid : modifier.paid
				}
			}
			return m;
		});
		if (board.overAllocatedSquares()) 
			SB.Error(SB.ErrMsg.OVER_ALLOCATED_SQUARES(board, member)); 

		return SB.Board.update({_id: boardID}, {$set: {members: board.members}});
	},
	addOwner: function addOwner(boardID, userID) {
		var board = SB.Board.findOne(boardID);
		var newOwner = SB.User.findOne(userID);

		if (SB.debug) {
			console.log("---- addOwner ----");
			console.log("boardID: ", boardID);
			console.log("userID: ", userID);
			console.log("---------------------------------");
		}
		// if (!SB.User.user())	SB.Error(SB.ErrMsg.NOT_LOGGED_IN_ERROR);
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!newOwner) SB.Error(SB.ErrMsg.INVALID_USER_ERROR);
		if (!board.isOwner(SB.User.user())) SB.Error("Only owners can add an owner.");

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
			console.log("---------------------------------");
		}
		if (!board) SB.Error(SB.ErrMsg.INVALID_BOARD_ERROR);
		if (!board.isOwner(SB.User.user())) SB.Error("Only owners can lock a board.");

		// if locked, unlock board
		if (board.locked) {
			SB.Board.update({_id: boardID},{$set: {
					winnerNumbers: null,
					loserNumbers: null,	
					locked: false			
				}
			});
		}
		else {
			SB.Board.update({_id: boardID},{$set: {
					winnerNumbers: [0,1,2,3,4,5,6,7,8,9].shuffle(),
					loserNumbers: [0,1,2,3,4,5,6,7,8,9].shuffle(),
					locked: true			
				}
			});
		}
	}
})



/*
	war7 failing to add static assets in package architecture. This is a work around
	until I can upgrade to 1.3.
	tried a bunch of things
	http://stackoverflow.com/questions/24143504/meteor-package-how-to-add-static-files   
	https://github.com/meteor/meteor/issues/5998
*/
var emailInvitationTemplate = 
"<html xmlns=\"http://www.w3.org/1999/xhtml\">"
+ "	<head>\n"
+ "		<meta name=\"viewport\" content=\"width=device-width\" />\n"
+ "		<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n"
+ "		<title>Invitation to {{boardName}} NCAA squares game</title>\n"
+ "		<link href=\"styles.css\" media=\"all\" rel=\"stylesheet\" type=\"text/css\" />\n"
+ "	</head>\n"
+ "\n"
+ "	<body itemscope itemtype=\"http://schema.org/EmailMessage\">\n"
+ "		Hello {{userName}}, <br>\n"
+ "		{{boardOwner}} has selected {{numSquares}} squares for you on \n"
+ "		{{boardName}}\'s\' NCAA squares game. <br>\n"
+ "		You can:\n"
+ "		<ol>\n"
+ "			<li>track game scores</li>\n"
+ "			<li>change squares</li>\n"
+ "			<li>and chat with other members</li>\n"
+ "		</ol>\n"
+ "		login with email: {{email}} and temporaryPassword: {{password}}\n"
+ "		<a href=\"squares.webhop.me/\">squares.webhop.me</a>\n"
+ "	</body>\n"
+ "</html>\n"








