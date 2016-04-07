if (Meteor.isServer) {
  Meteor.startup(function () {  
	Accounts.onCreateUser(function(options, user) {
	    user.profile = options.profile;
	    if (!user.profile.boardIDs) user.profile.boardIDs = [];
	    if (!user.profile.userName && user.username) user.profile.userName = user.username;
	    // console.log('Accounts.onCreateUser  afters: ', user);
	    return user
	})
  });
}

