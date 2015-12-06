var gulp = require('gulp'),
    fs = require('fs'),
    source = require('vinyl-source-stream'),
    sheet_id = require(process.cwd() + '/.players-sheet-id.json'),
    createStream = require('../lib/google-stream'),
    contributorTemplate = require('../lib/contributor-stream'),
    usedColumns = [
      'doyouwanttobegivencreditforthestoryaspartofthepodcast',
      'howwouldyoulikeyournametoappearinthepodcastepisodenotes',
      'urlforwhereyournameshouldlinkto',
      'gravatarurl'
    ],
    key = 'shortname',
    filter = 'doyouwanttobegivencreditforthestoryaspartofthepodcast';

gulp.task('build-player-json', function() {
    fs.unlink(process.cwd() + '/players.json', function() {
        var stream = createStream(sheet_id, key, usedColumns, filter);
        stream.go();
        stream
            .pipe(source('players.json'))
            .pipe(gulp.dest('.'));
    });
});

gulp.task('build-contributors-json', function() {
   gulp.src('episodes/*.json')
       .pipe(contributorTemplate())
       .pipe(gulp.dest('.'));
});