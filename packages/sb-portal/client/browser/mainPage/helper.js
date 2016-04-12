/*
	subscription in main layout
*/

Template.sbPortalMainPage.onCreated(function () {
	var instance = this;

  instance.autorun(function () {

    var userID = SB.User.ID()
  	var ret = instance.subscribe('sbPortalPublication', userID);
    console.log('onCreated: ', ret, userID);
  });
});



Template.sbPortalUserBoardsList.helpers({
	boards: function() {
		return SB.User.user().boards();
	}
});

Template.sbPortalUserBoard.helpers({
	boardName: function() {
		return this.name;
	},
	boardLink: function() {
		return "/board/"+ this._id;
	}
});


Template.sbPortalCreateBoardModalWidget.events({
  'click #sbPortalCreateBoardButton' : function(event){
    //event.preventDefault();
    console.log("click #sbPortalCreateBoardButton: ", this);
    Modal.show('sbPortalCreateBoardModal');
  },
  'change #category-select' : function(event) {
  	event.preventDefault();
  	// can't get the selection to trigger adding more fields
  	console.log("change select: ", $(event.target.boardType).find(':selected').data("id"))
  },
  'submit #sbPortalCreateBoardForm' : function(event) {
    event.preventDefault();
    var boardName = event.target.boardName.value;
    var boardType = $(event.target.boardType).find(':selected').data("id");

  	Meteor.call('createBoard', boardName, SB.User.ID(), function(err, res) {
  		if (err) handleServerError(err);
  		Router.go("/board/"+res);
  	})
    Modal.hide('sbPortalCreateBoardModal');
  }
});