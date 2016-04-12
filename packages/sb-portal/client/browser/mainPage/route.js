Router.route('/', {
	name: 'sbPortalMainPage',
	// waitOn: function() {
	// 	return Meteor.subscribe('sbPortalPublications', SB.User.ID());
	// },
});

Router.onBeforeAction(SB.Router.requireLogin, {except: ['sbPortalMainPage']});
Router.onBeforeAction('dataNotFound', {except: ['sbPortalMainPage']});
