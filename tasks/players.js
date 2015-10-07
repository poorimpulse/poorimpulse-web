var gulp = require('gulp'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    createStream = require('../lib/google-stream');

gulp.task('build-player-json', function() {
    fs.unlink(process.cwd() + '/players.json', function() {
        var stream = createStream();
        stream.go();
        stream
            .pipe(source('players.json'))
            .pipe(gulp.dest('.'));
    });
});
