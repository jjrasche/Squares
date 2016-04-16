/* 
	Error to throw in Meteor Methods that will not cause
	server error for client side exceptions.
*/
SB.namespacer('SB', {Error : 
	function(error, reason, details) {
		var error = new Meteor.Error(error, reason, details);
		if (Meteor.isClient) {
			return error;
		} else if (Meteor.isServer) {
			throw error;
		}
	}
});