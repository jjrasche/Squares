if (Meteor.isServer) {
  Meteor.startup(function () {
    process.env.MAIL_URL = "smtp://postmaster%40sandbox512e8ee0f83d46078573e5726aeaa184.mailgun.org:5d505bc4aea1d7e4671391989f1d5c1d@smtp.mailgun.org:587";
  
	Accounts.onCreateUser(function(options, user) {
	    //pass the surname in the options
	    console.log(options);
	    user.profile = {};
	    user.profile['userName'] = options.profile.userName;

	    console.log(user);


	    return user
	})
  });
}

