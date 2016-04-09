Router.route('/', {
  name: 'sbPortalMainPage',
});

Router.onBeforeAction(SB.Router.requireLogin, {except: ['sbPortalMainPage']});
Router.onBeforeAction('dataNotFound', {except: ['sbPortalMainPage']});
