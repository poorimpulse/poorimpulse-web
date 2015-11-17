var gulp = require('gulp'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    sheet_id = require(process.cwd() + '/.supporters-sheet-id.json'),
    createStream = require('../lib/google-stream');

gulp.task('build-supporters-page', function() {
    fs.unlink(process.cwd() + '/supporters.json', function() {
        var stream = createStream(sheet_id);
        stream.go();
        stream
            .pipe(source('supporters.json'))
            // Do Templatey Stuff here
            .pipe(gulp.dest('.'));
    });
});