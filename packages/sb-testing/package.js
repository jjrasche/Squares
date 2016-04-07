Package.describe({
  name: 'jjrasche:sb-testing',
  version: '0.0.1',
  summary: 'Tools that help us testing the app',
  debugOnly: true
});

Package.onUse(function (api) {  
  api.use([
    'jjrasche:sb' // testing package needs access to all data and methods of the full app 
  ], 'server');

  api.addFiles([
    'fixtureMethod.js'
    , 'baseFixtures.js'
    ], 'server');
});