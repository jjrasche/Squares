var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  summary: "templates, logic, and routes for using the Squares game",
  version: "0.0.1",
  name: "jjrasche:sb-game-scraper",
});

Package.onUse(function (api) {
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
  fibers : '1.0.10'
  ,request : '2.72.0'
  ,cheerio : '0.20.0'
  ,
});