var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  summary: "Base app for colleections and project wide dependencies.",
  version: "0.0.1",
  name: "jjrasche:sb-portal",
});


Package.onUse(function (api) {
  // server and client dependencies
  var packages = [
    'jjrasche:sb-base@0.0.1'
    ,'jjrasche:sb-user@0.0.1'    
    ,'jjrasche:sb-squares-board@0.0.1'
  ]
  api.use(packages);
  api.imply(packages);

  api.addFiles([], server);

  // client only files
  api.addFiles([
    'client/browser/mainPage/route.js'
    ,'client/browser/mainPage/helper.html'
    ,'client/browser/mainPage/layout.html'
    ,'client/browser/mainPage/helper.js'
  ], client);
});

Package.onTest(function (api) {  
  api.use(['jjrasche:sb-portal'
    ,'sanjo:jasmine@0.20.3'
    ,'jjrasche:sb-testing'    // debug only so only compiled when Testing
  ], both);

  api.addFiles('tests/jasmine/client/integration/wait_for_router_helper.js', 'client');
  api.addFiles('tests/jasmine/client/integration/portalPageTest.js', 'client');
});

Npm.depends({
});