// From:
// https://www.npmjs.com/package/browserify-css#2-how-do-i-load-font-and-image-files-from-node_modules
var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var browserify = require('browserify');
var sourceStream = require('vinyl-source-stream');
var fse = require('fs-extra');
var _ = require('lodash'); // Added by ellvtr

module.exports = function(relativeUrl) {
  var stripQueryStringAndHashFromPath = function(url) {
      return url.split('?')[0].split('#')[0];
  };
  var rootDir = process.cwd();
  // var rootDir = path.resolve(process.cwd(), 'src');
  var relativePath = stripQueryStringAndHashFromPath(relativeUrl);
  var queryStringAndHash = relativeUrl.substring(relativePath.length);

  // 
  // Copying files from '../node_modules/bootstrap/' to 'dist/vendor/bootstrap/' 
  // 
  var prefix = 'node_modules/';
  // var prefix = '../node_modules/';
rootDir
  // console.log('processRelativeUrl: \n', {rootDir, relativeUrl, relativePath, prefix});
  if (_.startsWith(relativePath, prefix)) {
      var vendorPath = 'vendor/' + relativePath.substring(prefix.length);
      var source = path.join(rootDir, relativePath);
      var target = path.join(rootDir, 'www', vendorPath);

      gutil.log('Copying file from ' + JSON.stringify(source) + ' to ' + JSON.stringify(target));
      fse.copySync(source, target);

      // Returns a new path string with original query string and hash fragments 
      return vendorPath + queryStringAndHash;
  }

  return relativeUrl;
}
