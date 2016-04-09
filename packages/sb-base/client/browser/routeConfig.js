Router.configure({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

SB.namespacer('SB.Router', {requireLogin : 
	function() {
	  if (! SB.User.user())
	    this.render('accessDenied');
	  else 
	    this.next();
	}
});