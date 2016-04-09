SB.namespacer('SB.fixture', {randomNumber : 
	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max-min)) + min;
	}
});

SB.namespacer('SB.fixture', {randomBool : 
	function randomBool() {
		return Math.floor(Math.random()*2)? true : false;
	}
});