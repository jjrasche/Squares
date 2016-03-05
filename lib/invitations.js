Invitation = new Meteor.Collection( 'invitations' );

var InvitationSchema = new SimpleSchema({
  "email": {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email address of the person requesting the invite."
  },
  "userName": {
    type: String,
    label: "userName tied to request, will show on board."
  },
  "token": {
    type: String,
    label: "The token for this invitation.",
    optional: true
  },
  "dateInvited": {
    type: Date,
    label: "The date this user was invited",
    optional: true
  },
  "accountCreated": {
    type: Boolean,
    label: "Has this invitation been accepted by a user?",
    optional: true
  },
  board : {
    type: Object,
  },
  "board._id": {
    type: String,
  },
  "board.numSquares": {
    type: Number
  }
});

Invitation.attachSchema(InvitationSchema);