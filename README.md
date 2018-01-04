# gulp-compare-json ![Build status](https://travis-ci.org/nolemmings/gulp-compare-json.svg?branch=master)

Gulp plugin for [compare-json](https://github.com/nolemmings/compare-json).

```javascript
'use strict';

var gulp = require('gulp');
var jsonCompare = require('gulp-compare-json');

gulp.task('default', function () {
  return gulp.src('fixture/*.json', { read: false })
    .pipe(jsonCompare({
      failOnError: true
    }));
});
```
