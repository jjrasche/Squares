Package.describe({
  summary: "Base app for colleections and project wide dependencies.",
  version: "0.0.1",
  name: "jjrasche:sb-portal",
});


Package.onUse(function (api) {

  // server and client dependencies
  var packages = ['jjrasche:sb-base@0.0.1'];
  api.use(packages);
  api.imply(packages);
  //api.use('templating')


  // client only files
  api.addFiles([
    'client/browser/mainPage/helper.html'
    ,'client/browser/mainPage/layout.html'
    ,'client/browser/mainPage/helper.js'
    ,'client/browser/mainPage/route.js'
  ],'client');
  // api.addFiles('email.js', 'server');
  // api.export('Email', 'server');

});

Package.onTest(function (api) {
});

Npm.depends({
});