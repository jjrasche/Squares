var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  summary: "Package organizing dependencies for Sport Betting App.",
  version: "0.0.1",
  name: "jjrasche:sb",
});


Package.onUse(function (api) {
  api.imply([
    'jjrasche:sb-base'
    ,'jjrasche:sb-game-scraper'        
    ,'jjrasche:sb-squares-board'    
    ,'jjrasche:sb-user'    
    ,'jjrasche:sb-portal'
  ], both);


  api.export('SB');
});

Package.onTest(function (api) {
});

Npm.depends({
});


/*
  mongorestore -h 127.0.0.1 --port 3001 -d meteor dump/meteor
  velocity test-packages jjrasche:sb-base --port 3002

  Model layout
  <AppName>.<Object>.model                  SB.Board.model.findOne(...)
  <AppName>.<Object>.<action>               SB.Board.modify
  <AppName>.<Object>.validate.<action>      
  
*/