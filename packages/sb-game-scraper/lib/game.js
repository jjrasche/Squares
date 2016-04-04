SB.namespacer('SB', {Game: 
	new Mongo.Collection('games', {
		transform: function (doc) { 
			return new GameModel(doc);
		}
  })
});


GameModel = function(doc) {
	_.extend(this, doc);
};

// instance methods
_.extend(GameModel.prototype, {
});

// static methods
_.extend(SB.Game, {
	getGames : function getGames(query, sort) {
		var baseQuery = [{date: {$gte: new Date(2016,01,01)}}];
		if (!sort) sort = {};
		if (!query) query = [];
		var parms = query.concat(baseQuery);
		var ret = this.find({$and: parms}, {sort: sort}).fetch();
		// console.log('getGames: ', JSON.stringify(parms), sort, ret.length);
		return ret;
	}
});




var TeamSchema = new SimpleSchema({
	"name": {
		type: String,
		label: "Team name."
	},
	"record": {
		type: Object,
		label: "Teams record."
	},
	"record.wins": {
		type: Number
	},
	"record.loses": {
		type: Number
	},
	"seed": {
		type: Number,
		min: 1,
		max: 16
	}
});

var gameTimeSchema = new SimpleSchema({
	"period": {
		type: Number,
		allowedValues: [0,1,2,3,4]
	},
	"secLeft": {
		type: Number,
		label: "seconds of gametime left",
		min: 0
	}
});



// var NCAATournamentGameSchema = new SimpleSchema({
// 	"round": {
// 		type: Number,
// 		allowedValues: [0,1,2,3,4,5,6],
// 		label: "Round in NCAATournament that game is in 0(play in) - 6(champinoship)"
// 	}
// })

var GameSchema = new SimpleSchema({
	// "gameType": {
	// 	type: Object,
	// 	allowedValues: ["NCAATournament"],
	// 	label: "what tournament and sport this board is for"
	// },
	// "NCAATournament": {
	// 	type: NCAATournamentGameSchema,
	// 	optional: true
	// },
	"round": {
		type: Number,
		allowedValues: [0,1,2,3,4,5,6],
		label: "Round in NCAATournament that game is in 0(play in) - 6(champinoship)"
	},
	"homeTeam": {
		type: TeamSchema,
		label: "Home team."
	},
	"homeScore": {
		type: Number,
		label: "Home team score.",
		defaultValue: false
	},
	"awayTeam": {
		type: TeamSchema,
		label: "Away Team."
	},
	"awayScore": {
		type: Number,
		label: "Away team score.",
		defaultValue: false
	},
	"date": {
		type: Date,
		label: "game date"
	},
	"location": {
		type: String,
		label: "location of game",
		optional: true
	},
	"time": {
		type: gameTimeSchema,
	},
	"finished": {
		type: Boolean,
		label: "game is over."
	}
});

SB.Game.attachSchema(GameSchema);