Template.chatMessages.helpers({
	messages: function() {
		return Message.find({}, { sort: { time: 1}});
	},
	name: function() {
		var user = Meteor.users.findOne({_id: this.userID});
		// console.log("chat: ", user, this);
		return user.profile.userName;
	},
	formatDate: function() {
		return this.date.messageFormat();
	}
});

Template.chatInput.events = {
	'keydown input#message' : function (event) {
		if (event.which == 13) { 
			var message = document.getElementById('message').value;
			Meteor.call('sendMessage', getBoard()._id, message, function(err, res) {
				if (err) console.log(err);
			})
			document.getElementById('message').value = '';
		}
	}
}