Package.describe({
  summary: "templates, logic, and routes for using the Squares game",
  version: "0.0.1",
  name: "jjrasche:sb-game-scraper",
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
    'lib/game.js'
    ,'lib/gameQueries.js'
    ,'lib/gameScraper.js'
    ,'server/fixture.js'
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