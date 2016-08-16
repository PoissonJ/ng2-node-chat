var path = require('path');
var Builder = require('systemjs-builder');
var del = require('del');

// Bundle the compiled js files
var builder = new Builder('public', 'public/systemjs.config.js');

// Start bundle here, systemjs will figure out the rest from the imports in the
// file. This will bundle the files into boot.js
builder.bundle('app/boot.js', './public/js/app/boot.js',
  {
    minify: true,
    encodeName: false // Allows for the templates to be in separate folders. Transforms relative into absolute paths
  })
  .then(function() {
    del(
      ['./public/js/app/**/*.js',
      '!./public/js/app/**/{boot.js, *.html, *.htm, *.css}'
      ])
    .then(function(paths) {
      console.log('Deleted files and folders:\n', paths.join('\n'));
    });
    console.log('Build completed!');
  })
  .catch(function(err) {
    console.log('Build error!');
    console.log(err);
  })
