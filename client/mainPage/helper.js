Template.userBoardsList.helpers({
	boards: function() {
		var ret;
		if (!Meteor.user()) ret = [];
		else ret = getUserBoards(Meteor.user());
		console.log('userBoardsList: ', ret);
		return ret;
	}
})


Template.userBoard.helpers({
	boardName: function() {
		console.log("boardName: ", this);
		return this.name;
	},
	boardLink: function() {
		return "/board/"+ this._id;
	}
})


Template.createBoardModal.events({
  'click #createBoardButton' : function(event){
    event.preventDefault();
    console.log("click #createBoardButton: ", this);
    Modal.show('createBoardModal');
  },
  'change #category-select' : function(event) {
  	event.preventDefault();
  	// can't get the selection to trigger adding more fields
  	console.log("change select: ", $(event.target.boardType).find(':selected').data("id"))
  },
  'submit #createBoardForm' : function(event) {
    event.preventDefault();
    var boardName = event.target.boardName.value;
    var boardType = $(event.target.boardType).find(':selected').data("id");

	Meteor.call('createBoard', boardName, function(err, res) {
		if (err) handleServerError(err);
		Router.go("/board/"+res);
	})
    Modal.hide('createBoardModal');
  }
});


var boardUrl = function boardUrl(boardID) {
	Router.go("/board/" + boardID)
}

Template.registerHelper("loggedIn", function() {
	return Meteor.userId();
});
Template.registerHelper("notLoggedIn", function() {
	return !Meteor.userId();
});