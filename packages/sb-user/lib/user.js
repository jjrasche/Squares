Meteor.users._transform = function(doc) {
  return new UserModel(doc);
}


UserModel = function(doc) {
  _.extend(this, doc);
};

// instance methods
_.extend(UserModel.prototype, {
  boards : function boards() {
    var boardIDs = this.profile.boardIDs; boardObjects = [];
    for (var i = 0; i < boardIDs.length; i++) {
      var board = SB.Board.findOne(boardIDs[i])
      boardObjects.push(board);
    }
    return boardObjects;
  }
});

_.extend(Meteor.users, {
});


var userProfileSchema = new SimpleSchema({
  userName: {
      type: String,
  },
  firstName: {
      type: String,
      optional: true
  },
  lastName: {
      type: String,
      optional: true
  },
  birthday: {
      type: Date,
      optional: true
  },
  gender: {
      type: String,
      allowedValues: ['Male', 'Female'],
      optional: true
  },
  organization : {
      type: String,
      optional: true
  },
  website: {
      type: String,
      regEx: SimpleSchema.RegEx.Url,
      optional: true
  },
  bio: {
      type: String,
      optional: true
  },
  boardIDs : {
    type: [String],
  }
});


var userSchema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both. It is OK to make this
    // optional here because the accounts-password package does its own validation.
    // Third-party login packages may not require either. Adjust this schema as necessary for your usage.
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: userProfileSchema,
  },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: Object,
    optional: true,
    blackbox: true
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true
  },
  status: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Meteor.users.attachSchema(userSchema);


