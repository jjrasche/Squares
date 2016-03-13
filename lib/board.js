Board = new Mongo.Collection('boards');


var NCAATournamentBoardSchema = new SimpleSchema({
  "roundPoints": {
    type: [Number],
    minCount: 6,
    maxCount: 6
  }
});


var schemaObject = {
  "name": {
    type: String,
    label: "name for the board."
  },
  "NCAATournament": {
    type: NCAATournamentBoardSchema,
    optional: true
  },
  "owners": {
    type: [String],
    label: "ID of the owner of the board"
  },
  "locked": {
    type: Boolean,
    label: "The token for this invitation.",
    defaultValue: false
  },
  "winnerNumbers": {
    type: [Number],
    label: "Order of the numbers of winner score",
    optional: true,
  },
  "loserNumbers": {
    type: [Number],
    label: "Order of the numbers of loser score",
    optional: true,
  },
  "dateCreated": {
    type: Date,
    label: "The date board was created",
    optional: true
  },
  "members": {
    type: Array,
    label: "List of members who have squares on this table"
  },
  "members.$": {
    type: Object,
  },
  "members.$._id": {
    type: String,
    label: "ID of member tied to this board."
  },
  "members.$.numSquares": {
    type: Number,
    label: "Number of squares alloted to this particular user."
  },
  "members.$.paid": {
    type: Boolean,
    label: "Wether this member is paid in full."
  }
}

// add all sq objects to the schema
for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 10; y++) {
    var obj = {
      type: String,
      label: "ID of owner of square in position (" + x + ", " + y + ") in the 10 x 10 map", 
      optional: true
    }
    schemaObject[getSquareKey(x, y)] = obj;
  }
}

var BoardSchema = new SimpleSchema(schemaObject);

Board.attachSchema(BoardSchema);