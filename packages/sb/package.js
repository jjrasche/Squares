Package.describe({
  summary: "Package organizing dependencies for Sport Betting App.",
  version: "0.0.1",
  name: "jjrasche:sb",
});


Package.onUse(function (api) {
  //api.versionsFrom('1.3.0');

  api.imply([
    'jjrasche:sb-base'
    ,'jjrasche:sb-game-scraper'        
    ,'jjrasche:sb-squares-board'    
    ,'jjrasche:sb-user'    
    ,'jjrasche:sb-portal'
  ], ['client', 'server']);


  // api.use('underscore', 'server');
  // api.use('iron:router@1.0.0');
  // api.imply('templating')
  // api.addFiles('email.js', 'server');
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