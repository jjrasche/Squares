Package.describe({
  summary: ".",
  version: "0.0.1",
  name: "jjrasche:sb-user",
});


Package.onUse(function (api) {
  var client = ['client'];
  var both = ['client', 'server'];

  // server and client dependencies
  api.use([
    'jjrasche:sb-base'
  ], both);

  // client only files
  api.addFiles([
    'lib/user.js'
  ], both);


  // client only dependencies
  api.use([
  ], client);


  // client only files
  api.addFiles([
  ], client);
});

Package.onTest(function (api) {
});

Npm.depends({
});