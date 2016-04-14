SB.namespacer('SB.User', {user :
  function user() {
    var user = Meteor.isClient ? Meteor.user() : this.user();
    if (user) return new SB.User.model(user);
    else return null;
  }
});

SB.namespacer('SB.User', {ID :
  function ID() {
    var userID = Meteor.isClient ? Meteor.userId() : this.userId();
    return userID;
    // if (user) return user._id;
    // else return null;
  }
});

SB.namespacer('SB.User', {findOne :
  // expects array of selector statements, sort object
  function findOne(selector, sort) {
    var selectObj = {}; sortObj = {};
    if (selector !== undefined && Object.keys(selector).length)
      selectObj = selector;
    if (sort !== undefined && Object.keys(sort).length)
      sortObj = sort;

    return Meteor.users.findOne(selectObj,
                                { sort: sortObj, 
                                  transform: function(doc) {
                                    return new SB.User.model(doc);
                                  }
                                });
  }
});

SB.namespacer('SB.User', {find :
  function find(selector, sort) {
    var selectObj = {}; sortObj = {};
    if (selector !== undefined && Object.keys(selector).length)
      selectObj = selector;
    if (sort !== undefined && Object.keys(sort).length)
      sortObj = sort;

    return Meteor.users.find(selectObj,
                              { sort: sortObj, 
                                transform: function(doc) {
                                  return new SB.User.model(doc);
                                }
                              });
  }
});

SB.namespacer('SB.User', {model :
  function(doc) {
    _.extend(this, doc);
  }
});

// instance methods
_.extend(SB.User.model.prototype, {
  boards : function boards() {
    var boardIDs = this.profile.boardIDs; boardObjects = [];
      console.log('boardIDs: ', boardIDs)
    for (var i = 0; i < boardIDs.length; i++) {
      var board = SB.Board.findOne(boardIDs[i])
      console.log('board: ', boardIDs[i], board);
      boardObjects.push(board);
    }
    return boardObjects;
  }
});




var userProfileSchema = new SimpleSchema({
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
  }, 
  online: { type: Boolean, optional: true, blackbox: true }
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


