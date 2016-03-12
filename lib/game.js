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


var GameSchema = new SimpleSchema({
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
	}
});

Game.attachSchema(GameSchema);

