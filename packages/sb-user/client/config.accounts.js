Accounts.ui.config({
    requestPermissions: {},
    passwordSignupFields: 'USERNAME_AND_EMAIL',
    // extraSignupFields: [{
        // fieldName: 'userName',
        // fieldLabel: 'user name',
        // inputType: 'text',
        // saveToProfile: true,
        // visible: true,
        // empty: 'ello buddy',
        // validate: function(value, errorFunction) {
        //   if (!value) {
        //     errorFunction("Please write your a user name");
        //     return false;
        //   } else {
        //     return true;
        //   }
        // }
    // }]
});

// 
// Accounts._loginButtons.validateUsername = function(username) {
//     if (username.length >= 2) {
//         return true;-*/
//     } else {
//         loginButtonsSession.errorMessage(i18n('errorMessages.usernameTooShort'));
//         return false;
//     }
// };