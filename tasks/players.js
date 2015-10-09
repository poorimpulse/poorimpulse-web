var gulp = require('gulp'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    createStream = require('../lib/google-stream'),
    contributorTemplate = require('../lib/contributor-stream');

gulp.task('build-player-json', function() {
    fs.unlink(process.cwd() + '/players.json', function() {
        var stream = createStream();
        stream.go();
        stream
            .pipe(source('players.json'))
            .pipe(gulp.dest('.'));
    });
});

gulp.task('build-contributors-json', function() {
    fs.unlink(process.cwd() + '/contributors.json', function() {
       gulp.src('episodes/*.json')
           .pipe(contributorTemplate())
           .pipe(gulp.dest('.'));
    });
});