// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
var configuration = {
  basePath: "",
  frameworks: ["jasmine", "@angular/cli"],
  plugins: [
    require("karma-jasmine"),
    require("karma-chrome-launcher"),
    require("karma-jasmine-html-reporter"),
    require("karma-coverage-istanbul-reporter"),
    require("karma-spec-reporter"),
    require("@angular/cli/plugins/karma")
  ],
  client:{
    clearContext: false // leave Jasmine Spec Runner output visible in browser
  },
  coverageIstanbulReporter: {
    reports: [ "html", "lcovonly" ],
    fixWebpackSourcePaths: true
  },
  customLaunchers: {
    Chrome_travis_ci: {
      base: 'Chrome',
      flags: ['--no-sandbox']
    }
  },
  angularCli: {
    environment: "dev"
  },
  reporters: ['spec'],
  port: 9876,
  colors: true,
  autoWatch: true,
  browsers: ["Chrome"],
  singleRun: true
};

if (process.env.TRAVIS) {
  configuration.browsers = ['Chrome_travis_ci'];
}


module.exports = function (config) {
  config.set(configuration);
};
