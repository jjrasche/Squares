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
    // ,'autopublish'
    ,'check'
  ];
  api.use(packages, both);
  api.imply(packages, both);
  // server and client files
  api.addFiles([
    'lib/namespace.js'
    ,'lib/dateEnhancements.js'
    ,'server/fixture.js'
    ,'lib/logging.js'
  ], both);


  packages = ['reywood:publish-composite'];
  api.use(packages, server);
  api.imply(packages, server);

  // server only files
  api.addFiles([
    'server/mailSettings.js'
    // ,'server/fixture.js'
  ], server);


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
    'client/browser/commonFunctions.js'
    ,'client/browser/appLayout.html'
    ,'client/browser/notFound.html'
    ,'client/browser/routeConfig.js'
  ], client);


  api.export(['SB', 'Meteor']);
});

Package.onTest(function (api) {  
  api.use(['jjrasche:sb-base'
    , 'sanjo:jasmine@0.21.0'
    // ,'jjrasche:sb-testing@0.0.1'
  ]);

  api.addFiles('tests/jasmine/server/unit/namespacerTests.js', server);

  api.export(['SB', 'Meteor']);
});

Npm.depends({
});