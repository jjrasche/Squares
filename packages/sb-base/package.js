Package.describe({
  summary: "Base app for colleections and project wide dependencies.",
  version: "0.0.1",
  name: "jjrasche:sb-base",
});


Package.onUse(function (api) {
  var client = ['client'];
  var both = ['client', 'server'];
  // server and client dependencies
  var dep = [
    'meteor-base'
    ,'jquery'
    ,'templating'
    ,'iron:router@1.0.12'
    ,'mobile-experience'
    ,'mongo'
    ,'accounts-base'
    ,'accounts-password'
    ,'email'
    ,'random'
    // ,'meteorhacks:ssr'
    ,'aldeed:collection2'
    ,'aldeed:autoform'
    ,'autopublish'
    ,'mizzao:user-status'
    ,'check'
  ];
  api.imply(dep, both);
  api.use(dep, both);

  // client only files
  api.addFiles([
    'lib/namespace.js'
    ,'lib/dateEnhancements.js'
  ], both);


  // client only dependencies
  dep = [
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
  api.imply(dep, client);
  api.use(dep, client);


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
    //,'velocity:core'
    // ,'velocity:console-reporter'
    //,'sanjo:jasmine'
    // ,'xolvio:cucumber'
  ]);
  api.imply(['jjrasche:sb-base'
    , 'sanjo:jasmine@0.20.3'
    //,'velocity:core'
    // ,'velocity:console-reporter'
    //,'sanjo:jasmine'
    // ,'xolvio:cucumber'
  ]);

  // console.log('Package.onTest: ',SB);

  api.addFiles('tests/jasmine/client/unit/namespacerTests.js', 'client');

  //api.export('SB');
});

Npm.depends({
});