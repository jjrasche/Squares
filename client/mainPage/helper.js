Template.createBoardButton.events({
	"click #createBoardButton": function(event) {
		event.preventDefault();

		Meteor.call('createBoard', 'boardName', function(err, res) {
			if (err) handleServerError(err);
			Router.go("/board/"+res);
		})
	}
}) 

