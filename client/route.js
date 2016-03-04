Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('mainPage', {
  });
});


Router.route('/board/:_id', function () {
  this.render('boardPage', {
    data: function () {
		var data = Board.findOne(this.params._id);
    	console.log("route data: ", this.params._id, data);
      return data;
    }
  });
});