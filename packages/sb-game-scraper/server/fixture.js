var GAMESPLAYED = 26; 

SB.namespacer('SB.Game.fixture', {teamNames : ["Butler","Dayton","Cincinnati","Gonzaga","Michigan State","UCLA","UC Irvine","Texas Southern","OSU","Belmont","E Washington","Northeastern","San Diego State","Wofford","UNC","Valparaiso","Oklahoma State","North Dakota St","Davidson","NC State","Robert Morris","Albany","UAB","Northern Iowa","Notre Dame","Wichita State","Buffalo","Hampton","Georgia","SF Austin","New Mexico St","Ole Miss","Harvard","Utah","West Virginia","LSU","Coast Carolina","Purdue","Xavier","Lafayette","Texas","Arizona","Iowa","Georgia State","Arkansas","Oregon","Indiana","Wyoming","Wisconsin"]});

SB.namespacer('SB.Game.fixture', {randomTeamName : 
	function randomTeamName() {
		var teamNames = SB.Game.fixture.teamNames;
		var idx = SB.fixture.randomNumber(0, teamNames.length-1);
		return teamNames[idx];
	}
});

SB.namespacer('SB.Game.fixture', {randomTeam : 
	function randomTeam() {
		var wins = SB.fixture.randomNumber(10, 26);
		return {
			name: SB.Game.fixture.randomTeamName(),
			record: {
				wins: wins,
				loses: GAMESPLAYED - wins
			},
			seed: SB.fixture.randomNumber(1, 16)
		};
	}
});

SB.namespacer('SB.Game.fixture', {randomGame : 
	function randomGame() {
		var finished = SB.fixture.randomBool(); started = SB.fixture.randomBool(); time = {};
		if (!finished) {
			if (!started) {
				time.period = 1;
				time.secLeft = 1200;
			} 
			else {
				time.period = SB.fixture.randomNumber(1, 2);
				time.secLeft = SB.fixture.randomNumber(1, 1200);
			}
		}
		else {
			time.period = SB.fixture.randomNumber(2, 5);
			time.secLeft = 0;
		}

		return {
			awayTeam: SB.Game.fixture.randomTeam(),
			homeTeam: SB.Game.fixture.randomTeam(),
		    homeScore: SB.fixture.randomNumber(40, 120),
		    awayScore: SB.fixture.randomNumber(40, 120),
		    date: new Date(SB.fixture.randomNumber(1457466055932, 1459363255932)),
		    time: time,
		    finished: finished,
		    round: SB.fixture.randomNumber(0, 6)
		}
	}
});

