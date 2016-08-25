var gulp = require('gulp');

var appDev = 'assets/app';
var appProd = 'public/js/app';
var vendor = 'public/js/vendor';

var BROWSER_SYNC_RELOAD_DELAY = 1000;

var  gulpSourcemaps = require('gulp-sourcemaps'),
  gulpTypescript = require('gulp-typescript'),
  nodemon = require('gulp-nodemon'),
  browserSync = require('browser-sync'),
	del = require('del');

var tsconfig = gulpTypescript.createProject('tsconfig.json');

gulp.task('build-vendor', function() {
  gulp.src('node_modules/@angular/**') // load all angular files
    .pipe(gulp.dest(vendor + '/@angular')); // Move to specified folder

  gulp.src('node_modules/core-js/**')
    .pipe(gulp.dest(vendor + '/core-js'));

  gulp.src('node_modules/reflect-metadata/**')
    .pipe(gulp.dest(vendor + '/reflect-metadata/'));

  gulp.src('node_modules/rxjs/**')
    .pipe(gulp.dest(vendor + '/rxjs/'));

  gulp.src('node_modules/systemjs/**')
    .pipe(gulp.dest(vendor + '/systemjs/'));

  gulp.src('node_modules/ng2-bootstrap/**')
    .pipe(gulp.dest(vendor + '/ng2-bootstrap/'));

  gulp.src('node_modules/moment/**')
    .pipe(gulp.dest(vendor + '/moment/'));

  gulp.src('node_modules/zone.js/**')
    .pipe(gulp.dest(vendor + '/zone.js/'));
});

gulp.task('build-ts', function() {
  return gulp.src(appDev + '/**/*.ts') // load all ts files
    .pipe(gulpSourcemaps.init()) // inits source maps
    .pipe(gulpTypescript(tsconfig)) // compile ts files
    .pipe(gulpSourcemaps.write())  // must be after ts compilation
    .pipe(gulp.dest(appProd)); // where to write the compiled ts files to
});

gulp.task('build-copy', function() {
  return gulp.src([appDev + '/**/*.html', appDev + '/**/*.css']) // load all css and html files
    .pipe(gulp.dest(appProd)); // Move to specified folder
});

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    // nodemon our expressjs server
    script: './bin/www',
    // watch core server file(s) that require server restart on change
		ignore: ['./assets/', './node_modules/', './public/', './typings']
  })
  .on('start', function onStart() {
    // ensure start only got called once
    if (!called) { cb(); }
    called = true;
  }, BROWSER_SYNC_RELOAD_DELAY)
  .on('restart', function onRestart() {
    // reload connected browsers after a slight delay
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, BROWSER_SYNC_RELOAD_DELAY);
  });
});

gulp.task('browser-sync', ['nodemon'], function() {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',
    port: 4000,
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

gulp.task('watch', function() {
  gulp.watch(appDev + '/**/*.ts', ['build-ts', browserSync.reload]); // compile ts when it's changed
  gulp.watch(appDev + '/**/*.html', ['build-copy', browserSync.reload]);
  gulp.watch(appDev + '/**/*.css',  ['build-copy', browserSync.reload]);
});


gulp.task('clean', function() {
  del(appProd + '/*');
  del(vendor + '/*');
});

gulp.task('default', ['build-vendor', 'watch', 'build-ts', 'build-copy', 'browser-sync']);
