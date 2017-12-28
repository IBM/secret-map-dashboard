// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

<<<<<<< HEAD
const { SpecReporter } = require("jasmine-spec-reporter");
=======
const { SpecReporter } = require('jasmine-spec-reporter');
>>>>>>> 57a0fb364bb841909c0ac2330f374eb37d2780ca

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
<<<<<<< HEAD
    "./e2e/**/*.e2e-spec.ts"
  ],
  capabilities: {
    "browserName": "chrome"
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
=======
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
>>>>>>> 57a0fb364bb841909c0ac2330f374eb37d2780ca
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare() {
<<<<<<< HEAD
    require("ts-node").register({
      project: "e2e/tsconfig.e2e.json"
=======
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
>>>>>>> 57a0fb364bb841909c0ac2330f374eb37d2780ca
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
