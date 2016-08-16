var map = { // Only need paths that we use in the app and are not imported in html
  'app': 'js/app',
  'rxjs': 'js/vendor/rxjs',
  '@angular': 'js/vendor/@angular',
  'ng2-bootstrap': 'js/vendor/ng2-bootstrap',
  'moment': 'js/vendor/moment/moment.js'
};
var packages = {
  'app': { main: 'boot.js', defaultExtension: 'js' }, // Append .js on import statements
  'rxjs': { defaultExtension: 'js' }, // Only default Extension, no boot file
  'ng2-bootstrap': { defaultExtension: 'js'}
};

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  '@angular/upgrade'
];

packageNames.forEach(function(pkgName) {
  packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
});

var config = {
  map: map,
  packages: packages
};

System.config(config);
