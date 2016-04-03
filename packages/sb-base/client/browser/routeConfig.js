Router.configure({
  layoutTemplate: 'ApplicationLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

var requireLogin = function() {
  if (! Meteor.user()) {
    this.render('accessDenied');
  } else {
    this.next();
  }
}

Router.onBeforeAction(requireLogin, {except: ['mainPage']});
Router.onBeforeAction('dataNotFound', {except: ['mainPage']});