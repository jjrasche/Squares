Template.createBoardButton.events({
	"click #createBoardButton": function(event) {
		event.preventDefault();
		if(!Meteor.user()) {
			alert("must log in to create board");
			return
		} else {
			console.log('clicked button');
			Meteor.call('createBoard', 'boardName', function(err, res) {
				if (!err) {
					var boardID = res;
					console.log('res: ', res);
					Router.go("/board/"+boardID);
				}
			})
		}
	}
}) 