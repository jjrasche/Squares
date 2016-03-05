invitationHooks = {
  before: {
    insert: function(doc) {
      var squares = Session.get('boardPageselectedSquares');
      var boardID = Session.get('boardPageBoardID');

      // Meteor.call('modifyBoard', boardID, squares, false, function(err, res) {
      //   console.log('modifyBoard: ', err, res);

      //   if(!err) {
      //     Session.set('boardPageselectedSquares', []);
      //   } else 
      //     throw err;
      // });

      Meteor.call('modifyBoard', boardID, squares, 
        function(err, res) {
          console.log('modifyBoard: ', err, res);
      });
      //send email to user with sign up instructures. When they sign up, link the newly created user with the invitation.
      Meteor.call('sendInvitation', doc.email, doc.userName, boardID, squares, 
        function(err, res) {
          console.log('sendInvitationReturn: ', err, res);
      });

      // Then return it or pass it to this.result()
      return doc; //(synchronous)
      //return false; (synchronous, cancel)
      // this.result(doc); (asynchronous)
      //this.result(false); (asynchronous, cancel)
    }
  }
  //,
  // after: {
  //   insert: function(error, result) {
  //     console.log("after: ");
  //   }
  // },
  // onSubmit: function(insertDoc, updateDoc, currentDoc) {
  //         console.log("onSubmit: ");

  //   this.done(); // submitted successfully, call onSuccess
  //   //this.done(new Error('foo')); // failed to submit, call onError with the provided error
  //   //this.done(null, "foo"); // submitted successfully, call onSuccess with `result` arg set to "foo"
  // },

  // // Called when any submit operation succeeds
  // onSuccess: function(formType, result) {
  //   console.log("onSuccess: ");
  // },

  // // Called when any submit operation fails
  // onError: function(formType, error) {
  //   console.log("onError: ");
  // },

  // // Called every time an insert or typeless form
  // // is revalidated, which can be often if keyup
  // // validation is used.
  // formToDoc: function(doc) {
  //   console.log("formToDoc: ");
  //   // alter doc
  //   return doc;
  // },

  // // Called every time an update or typeless form
  // // is revalidated, which can be often if keyup
  // // validation is used.
  // formToModifier: function(modifier) {
  //   console.log("formToModifier: ");
  //   // alter modifier
  //   return modifier;
  // },

  // // Called whenever `doc` attribute reactively changes, before values
  // // are set in the form fields.
  // docToForm: function(doc, ss) {
  //   console.log("docToForm: ");
  // },

  // // Called at the beginning and end of submission, respectively.
  // // This is the place to disable/enable buttons or the form,
  // // show/hide a "Please wait" message, etc. If these hooks are
  // // not defined, then by default the submit button is disabled
  // // during submission.
  // beginSubmit: function() {
  //   console.log("beginSubmit: ", this);
  // },
  // endSubmit: function() {
  //   console.log("endSubmit: ", this);
  // } 
}

console.log("invitationHooks after: ", invitationHooks);
AutoForm.addHooks('invitationForm', invitationHooks);
