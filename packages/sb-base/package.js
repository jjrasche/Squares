var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  summary: "Base app for colleections and project wide dependencies.",
  version: "0.0.1",
  name: "jjrasche:sb-base",
});


Package.onUse(function (api) {
  // server and client dependencies
  var packages = [
    'meteor-base'
    ,'jquery'
    ,'templating'
    ,'iron:router@1.0.12'
    ,'mobile-experience'
    ,'mongo'
    ,'email'
    ,'random'
    // ,'meteorhacks:ssr'
    ,'aldeed:collection2'
    ,'aldeed:autoform'
    ,'autopublish'
    ,'check'
  ];
  api.use(packages, both);
  api.imply(packages, both);
  // server and client files
  api.addFiles([
    'lib/namespace.js'
    ,'lib/dateEnhancements.js'
  ], both);


  // server only files
  api.addFiles([
    'server/mailSettings.js'
  ],'server');


  // client only dependencies
  packages = [
    'tracker'
    ,'blaze-html-templates'
    ,'session'
    ,'standard-minifiers'
    ,'es5-shim'
    ,'ecmascript'
    ,'highcharts:highcharts-meteor'
    ,'highcharts-container'
    ,'ian:accounts-ui-bootstrap-3'
    ,'twbs:bootstrap'
    ,'peppelg:bootstrap-3-modal'
    ,'yogiben:autoform-modals'
    ,'sacha:spin'
    ,'afruth:chapp'
  ]
  api.use(packages, client);
  api.imply(packages, client);

  // client only files
  api.addFiles([
    'client/browser/appLayout.html'
    ,'client/browser/notFound.html'
    ,'client/browser/routeConfig.js'
    ,'client/config.accounts.js'
  ],'client');


  api.export('SB');
});

Package.onTest(function (api) {  
  api.use(['jjrasche:sb-base'
    , 'sanjo:jasmine@0.20.3'
  ]);

  api.addFiles('tests/jasmine/client/unit/namespacerTests.js', 'client');
});

Npm.depends({
});