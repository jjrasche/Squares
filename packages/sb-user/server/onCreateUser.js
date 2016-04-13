if (Meteor.isServer) {
  Meteor.startup(function () {  
	Accounts.onCreateUser(function(options, user) {
	    user.profile = options.profile;
	    if (!user.profile.boardIDs) user.profile.boardIDs = [];
	    // console.log('Accounts.onCreateUser  afters: ', user);
	    return user
	})
  });
}

