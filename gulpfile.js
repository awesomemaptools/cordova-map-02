// Require stuff:
const log = require('./src/misc/ConsoleLog');
const gulp = require('gulp');
const shell = require('gulp-shell');
// const myth = require('gulp-myth');
const eslint = require('gulp-eslint');
// const imagemin = require('gulp-imagemin');
// const connect = require('connect'); 
// const serve = require('serve-static');
// const browsersync = require('browser-sync');
const browserify = require('browserify');
// const browserifyCss = require('browserify-css');
const source = require('vinyl-source-stream');
// const plumber = require('gulp-plumber');
// const beeper = require('beeper');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const watchify = require('watchify');
const babel = require('babelify');
const path = require('path');
// const sass = require('gulp-sass');
// const sassImporter = require('sass-module-importer');
// const util = require('gulp-util');
const vueify = require('vueify');
const hmr = require('browserify-hmr');
const noop = require('gulp-util').noop;
const uglify = require('gulp-uglify');
const processRelativeUrl = require('./gulp/processRelativeUrl');

// Set various parameters:
const env = process.env.NODE_ENV || 'dev'; log({env});
const dev = (env == 'dev');
// const WATCH = process.env.WATCH === 'false' ? false : true; log({WATCH});
const buildFolder = path.join(__dirname, '/www/js');
// console.log('log: buildFolder', buildFolder);

gulp.task('dummy', ()=>{ log({dummy:'gulp dummy task'}); });

// Start frontend server after build:js has finished:
gulp.task('serve', ["build:js"], ()=>{
    return gulp.src('', {read: false})
      .pipe(shell(['node node_modules/http-server/bin/http-server ./www -c-1 -a localhost']));
  }
);
// Test http-server when it fails:
gulp.task('http', 
  // shell.task(['http-server ./www -c-1 -a localhost'])
  shell.task(['node node_modules/http-server/bin/http-server ./www -c-1 -a localhost'])
);

// Browserify Task
gulp.task('browserify', function() {
  console.log('browserify');
  return browserify('./src/main.js')
  	.transform(vueify)
  	.transform(babel)
    .bundle()
    .pipe(source('build.js'))
    .pipe(gulp.dest(buildFolder));
});

// task build:js - from joachim:
gulp.task('build:js', () => {
	var bundler = browserify('./src/main.js', { debug: true, cache: {}, packageCache: {} })
		.transform(vueify)
		.transform(babel)
		.transform('browserify-css', { 
      autoInject: {verbose:true, insertAt:'top'}
      ,minify:true
      ,processRelativeUrl: processRelativeUrl
    });
		// .transform('browserify-css', { autoInject:true, minify:true });
	// console.log('log: bundler');

	if (dev) {
		// bundler.plugin(hmr, { mode: 'websocket', url: 'http://localhost:3123' });
    bundler = bundler.plugin(watchify);
		// bundler = watchify(bundler);

		// if(WATCH) {
      // log({str:'if(WATCH)', WATCH});
      // bundler = watchify(bundler);
      bundler.on('update', function() {
  			console.log('-> bundling...');
  			rebundle();
  		});
    // }
	} // if(dev)

	function rebundle() {
		// console.log('log: start rebundle');
		return bundler.bundle()
      // .pipe(plumber({errorHandler: err=>{ log({err}); beeper(); } }))
			.on('error', function(err) {
				console.error('on build:js error',err);
				this.emit('end');
			})
			.pipe(source('build.js')) 
			.pipe(buffer())
			.pipe(dev ? sourcemaps.init({ loadMaps: true }) : noop())
			.pipe(dev ? sourcemaps.write() : noop())
			.pipe(dev ? noop() : uglify())
			.pipe(gulp.dest(buildFolder));
	}

	return rebundle();
}); // task build:js

// Clean Task
gulp.task('clean', function () {
  del([buildFolder+'/build.js']);
  del([buildFolder+'/vendor/*']);
  // del(['dist/*']);
});

gulp.task('eslint', () => {
  return gulp.src(['./src/**/*.{js,vue}']) // (['.-src/**/*','!node_modules/**'])
    .pipe(eslint())
    // .pipe(eslint.formatEach())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())
    ;
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*', ['eslint']);
  // gulp.watch('./src/**/*', ['eslint','clean','browserify']);
});

/*gulp.task('plumber', function(){
  plumber({errorHandler: err=>{ log({err}); beeper(); } });
});*/

// gulp.task('default', ['plumber', 'clean', 'build:js', 'serve', 'watch', 'eslint']);
gulp.task('default', ['clean', 'watch', 'eslint', 'serve']);
// gulp.task('default', ['clean', 'serve', 'watch', 'eslint']);
// gulp.task('default', ['clean', 'build:js', 'serve', 'watch', 'eslint']);
