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

  // server and client files
  api.addFiles([
    'lib/board.js'
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
});

Npm.depends({
});