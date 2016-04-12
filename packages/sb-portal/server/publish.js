/*
	when using SB.User.ID() get following errors
		[RangeError: Maximum call stack size exceeded]
	this.userId()
		[TypeError: Property 'userId' of object [object Object] is not a function]
*/
Meteor.publishComposite('sbPortalPublication', function(userID) {
	return {
	    find: function() {
	        // // publish logged in user
	        // var userID; 
	        // try {
	        // 	userID = Meteor.userId();
	        // }
	        // catch (e) {
	        // 	console.log(e);
	        // }
	        console.log('userID: ', userID, SB.User.find({_id: userID}).count());
	        return SB.User.find({_id: userID});
	    },
	    children: [
	        {   // publish user's Boards
	            find: function(user) {
	          		var boardIDs = user.profile.boardIDs ? user.profile.boardIDs : [];
	          		console.log('boardIDs: ' +  JSON.stringify(boardIDs) + '     userID: ' + user._id);
	                return SB.Board.find({_id: {$in: boardIDs}});
	            }
	        },
	        {   // publish  viewable Boards
	            find: function(user) {
	                var ret = SB.Board.find({}, {limit: SB.Portal.viewableBoardsLimit});
	                console.log('viewable Boards ' + ret.count());
	                return SB.Board.find({}, {limit: SB.Portal.viewableBoardsLimit});
	            }
	        }
	    ]
	}
});