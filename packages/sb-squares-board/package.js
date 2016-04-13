var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  summary: "templates, logic, and routes for scraping game data.",
  version: "0.0.1",
  name: "jjrasche:sb-squares-board",
});

Package.onUse(function (api) {
  // server and client dependencies
  api.use([
    'jjrasche:sb-base'
  ], both);
  api.imply([
    'jjrasche:sb-base'
  ], both);

  // server and client files
  api.addFiles([
    'lib/board/baseFunctions.js'
    ,'lib/board/staticMethods.js'
    ,'lib/board/schema.js'
    ,'lib/board/modificationFunctions.js'
    ,'lib/meteorMethods.js'
  ], both);


  // server only dependencies
  api.use([
  ], server);

  // server only files
  api.addFiles([
    'server/publish.js'
  ], server);


  // client only dependencies
  api.use([
  ], client);

  // client only files
  api.addFiles([
    'client/browser/sessionMethods.js'
    ,'client/browser/BoardPage/helper.html'
    ,'client/browser/BoardPage/style.css'
  	,'client/browser/BoardPage/layout.html'
    ,'client/browser/BoardPage/helper.js'   
  	,'client/browser/BoardPage/route.js'  	
  ], client);
});

Package.onTest(function (api) {
  api.use(['jjrasche:sb-squares-board'
    , 'sanjo:jasmine@0.21.0'
    ,'jjrasche:sb-testing@0.0.1'    // debug only so only compiled when Testing
  ]);

  api.addFiles('tests/jasmine/client/integration/wait_for_router_helper.js', client);
  // api.addFiles('tests/jasmine/client/integration/boardPageTest.js', client);
  api.export(['SB', 'Meteor']);
});

Npm.depends({
});