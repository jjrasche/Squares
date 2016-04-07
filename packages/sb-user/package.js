Package.describe({
  summary: ".",
  version: "0.0.1",
  name: "jjrasche:sb-user",
});


Package.onUse(function (api) {
  var client = ['client'];
  var server = ['server'];
  var both = client.concat(server);

  // server and client dependencies
  var packages = [
    'jjrasche:sb-base'
    ,'mizzao:user-status'
    ,'accounts-base'
    ,'accounts-password'
  ]
  api.use(packages, both);
  api.imply(packages, both);

  // client only files
  api.addFiles([
    'lib/user.js'
  ], both);


  // server only dependencies
  api.use([
  ], server);

  // server only files
  api.addFiles([
    'server/onCreateUser.js'
  ], server);


  // client only dependencies
  api.use([
  ], client);

  // client only files
  api.addFiles([
  ], client);
});

Package.onTest(function (api) {
  api.use(['jjrasche:sb-portal'
    ,'sanjo:jasmine@0.20.3'
    ,'jjrasche:sb-testing@0.0.1'    // debug only so only compiled when Testing
  ]);
});

Npm.depends({
});