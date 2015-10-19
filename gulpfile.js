'use strict';

var gulp = require('gulp');
var jsonCompare = require('./');

gulp.task('default', function () {
  return gulp.src('fixture/*.json').pipe(jsonCompare({}));
});
