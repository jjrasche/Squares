Router.configure({
  layoutTemplate: 'ApplicationLayout',
  notFoundTemplate: 'notFound'
});

///Router.onBeforeAction('dataNotFound');
//Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});


Router.route('/', function () {
  this.render('mainPage', {
  });
});


Router.route('/board/:_id', function () {
  this.render('boardPage', {
    data: function () {
      var id = this.params._id
      var data = Board.findOne(id);
      Session.set('boardPageBoardID', id);
    	// console.log("route data: ", id, data);
      return data;
    }
  });
});