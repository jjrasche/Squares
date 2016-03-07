Accounts.ui.config({
    requestPermissions: {},
    extraSignupFields: [{
        fieldName: 'userName',
        fieldLabel: 'user name',
        inputType: 'text',
        saveToProfile: true,
        visible: true,
        empty: 'ello buddy',
        validate: function(value, errorFunction) {
          if (!value) {
            errorFunction("Please write your a user name");
            return false;
          } else {
            return true;
          }
        }
    }]
});