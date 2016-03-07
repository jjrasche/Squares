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
    Modal.show('createBoardModal', this);
  },
  'submit #createBoardForm' : function(event) {
    event.preventDefault();
    var boardName = event.target.boardName.value;
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
