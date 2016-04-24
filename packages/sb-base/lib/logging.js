SB.namespacer('SB', {debug: false});

SB.namespacer('SB', {handleServerError : 
	function handleServerError(err) {
    	console.log("handleServerError: ", err);
    	if (Meteor.isClient) alert(err);
    }
});

SB.namespacer('SB', {handleClientError : 
	function handleClientError(err) {
    	console.log("handleClientError: ", err);
    }
});

/* 
	Error to throw in Meteor Methods that will not cause
	server error for client side exceptions.
*/
SB.namespacer('SB', {Error : 
	function(error, reason, details) {
		// console.log('SB.Error: ', error, reason, details);
		var error = new Meteor.Error(error, reason, details);
		if (Meteor.isClient) {
			return error;
		} else if (Meteor.isServer) {
			throw error;
		}
	}
});