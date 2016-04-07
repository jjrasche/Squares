Package.describe({
  summary: "templates, logic, and routes for scraping game data.",
  version: "0.0.1",
  name: "jjrasche:sb-squares-board",
});


Package.onUse(function (api) {
  var client = ['client'];
  var both = ['client', 'server'];

  // server and client dependencies
  api.use([
    'jjrasche:sb-base'
  ], both);
  api.imply([
    'jjrasche:sb-base'
  ], both);

  // server and client files
  api.addFiles([
    'lib/board.js',
    'lib/meteorMethods.js'
  ], both);


  // client only dependencies
  api.use([
  ], client);


  // client only files
  api.addFiles([
    'client/browser/sessionMethods.js'
    ,'client/browser/BoardPage/helper.html'
    ,'client/browser/BoardPage/style.css'
  	,'client/browser/BoardPage/helper.js'  	
  	,'client/browser/BoardPage/layout.html'
  	,'client/browser/BoardPage/route.js'  	
  ], client);
});

Package.onTest(function (api) {
  api.use(['jjrasche:sb-squares-board'
    , 'sanjo:jasmine@0.20.3'
    // ,'jjrasche:sb-testing@0.0.1'    // debug only so only compiled when Testing
  ]);
});

Npm.depends({
});