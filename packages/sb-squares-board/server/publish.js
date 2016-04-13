// Meteor.publish('getBoard', function(id) {
// 	return SB.Board.find(id);
// });

// Meteor.publish('getBoardUsers', function(id) {
// 	var board = SB.Board.find(id);
// 	return SB.User.find({_id: {$in: board.members}});
// });

// Meteor.publish('getUserBoards', function(id) {
// 	var boardIDs = SB.User.user().profile.boardIDs;
// 	return SB.Board.find({_id: {$in: boardIDs}});
// });

// Meteor.publish("userData", function (userIDs) {
//     return SB.User.find({_id: {$in: userIDs}},{
//     	fields: {
//         	'status': 1
//         }
//     });
// });



Meteor.publishComposite('sbSquaresBoardPublication', function(boardID) {
	return {
	    find: function() {
	    	console.log('sbPortalPublication', boardID, SB.Board.find({_id: boardID}).count());
	        return SB.Board.find({_id: boardID});
	    }
	    ,
	    children: [
	        {   // publish Board users
	            find: function(board) {
	          		var ret = board.memberQuery();
	          		console.log(ret.count() + ' users of board \'' + board.name + '\'');
	                return ret
	            }
	        },
	        {   // publish Board games
	            find: function(board) {
	                var ret = board.gameQuery();
	          		console.log(ret.count() + ' games for board \'' + board.name + '\'');	                
	                return ret;
	            }
	        }
	    ]
	}
});