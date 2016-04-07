Router.configure({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

SB.namespacer('SB.Router', {requireLogin : 
	function() {
	  if (! Meteor.user())
	    this.render('accessDenied');
	  else 
	    this.next();
	}
});