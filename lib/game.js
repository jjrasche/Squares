// need a way to tie the values of a game (round) to values of a board (score/round)
// https://github.com/aldeed/meteor-autoform/issues/924  conditionally hide fields in schema from autoform

Game = new Mongo.Collection('games');


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
	finished: {
		type: Boolean,
		label: "game is over."
	}
});

Game.attachSchema(GameSchema);

