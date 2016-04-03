Package.describe({
  summary: "templates, logic, and routes for using the Squares game",
  version: "0.0.1",
  name: "jjrasche:sb-game-scraper",
});


Package.onUse(function (api) {
  //api.versionsFrom('1.3.0');
  api.imply('jjrasche:sb-base');
  // api.imply('templating')
  // api.addFiles('email.js', 'server');
  // api.export('Email', 'server');


});

Package.onTest(function (api) {
});

Npm.depends({
});