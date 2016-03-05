var squareSchema = new SimpleSchema({
  "ownerObject": {
    type: String,
    allowedValues: ['Invitation', 'User'],
    optional: true
  },
  "ownerID": {
    type: String,
    optional: true
  }
});


Board = new Mongo.Collection('boards');

var schemaObject = {
  "name": {
    type: String,
    label: "name for the board."
  },
  "owner": {
    type: String,
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
  }
}

// add all sq objects to the schema
for (var x = 0; x < 10; x++) {
  for (var y = 0; y < 10; y++) {
    // var key = getSquareKey(x, y);
    var obj = {
      type: squareSchema,
      label: "square in position (" + x + ", " + y + " in the 10 x 10 map" 
    }
    schemaObject[getSquareKey(x, y)] = obj;
  }
}

var BoardSchema = new SimpleSchema(schemaObject);

Board.attachSchema(BoardSchema);