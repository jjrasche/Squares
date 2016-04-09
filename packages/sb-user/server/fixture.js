SB.namespacer('SB.User.fixture', {formObject : 
	function formObject(email, userName, password) {
		return {
				email: email, 
				username: userName,
				profile: {
					userName: userName
				},
				password: password
		}
	}
});