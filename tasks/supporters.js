var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    sheet_id = require(process.cwd() + '/.supporters-sheet-id.json'),
    createStream = require('../lib/google-stream');

gulp.task('build-supporters-json', function() {
  var stream = createStream(sheet_id, 'shortname');
  stream.go();
  stream
      .pipe(source('supporters.json'))
      .pipe(gulp.dest('.'));
});
