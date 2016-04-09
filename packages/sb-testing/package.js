var client = ['client'];
var server = ['server'];
var both = client.concat(server);

Package.describe({
  name: 'jjrasche:sb-testing',
  version: '0.0.1',
  summary: 'Tools that help us testing the app',
  debugOnly: true
});

Package.onUse(function (api) {  
  api.use([
    'jjrasche:sb' // testing package needs access to all data and methods of the full app 
    ,'velocity:html-reporter'
  ], both);

  api.addFiles([
    'fixtureMethod.js'
    , 'baseFixtures.js'
    ], 'server');
});

Package.onTest(function (api) {
})