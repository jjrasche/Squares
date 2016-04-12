Template.registerHelper("loggedIn", function() {
	return SB.User.ID();
});
Template.registerHelper("notLoggedIn", function() {
	return !SB.User.ID();
});