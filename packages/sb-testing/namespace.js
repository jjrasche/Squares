// add to namespace so tests can use users
SB.namespacer('SB.fixture', {tester: {email:'test@test.com', username:'tester', password:'tttttt'}});
SB.namespacer('SB.fixture', {tester2: {email:'test2@test.com', username:'tester2', password:'tttttt'}});
SB.namespacer('SB.fixture', {tester3: {email:'test3@test.com', username:'tester3', password:'tttttt'}});


SB.namespacer('SB.testing', {enterInput: function(value, elementSelector) {
	var ele = jQuery(elementSelector).eq(0);
	ele.val(value);

	var e = jQuery.Event("keypress");
	e.which = 13 
	ele.trigger(e);
}});