ReAssignment = new Meteor.Collection( 'reassignments' );

var ReAssignmentSchema = new SimpleSchema({
  "userName": {
    type: String,
    label: "userName tied to request, will show on board."
  }
});

ReAssignment.attachSchema(ReAssignmentSchema);