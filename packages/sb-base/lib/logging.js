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