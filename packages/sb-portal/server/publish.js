Meteor.publishComposite('sbPortalPublications', {
    find: function(userID) {
        // publish logged in user 
        var user = SB.User.user();
        return SB.User.find({_id: userID});
    },
    children: [
        {   // publish user's Boards
            find: function(user) {
                var boardIDs = user.profile.boardIDs;
                return SB.Board.find({_id: {$in: boardIDs}});
            }
        },
        {   // publish  viewable Boards
            find: function() {
                return SB.Board.find({}, {limit: SB.Portal.viewableBoardsLimit});
            }
        }
    ]
});