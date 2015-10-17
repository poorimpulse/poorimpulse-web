var gulp = require('gulp'),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    fs = require('fs');

var home = process.env.HOME || process.env.USERPROFILE;
var credentials = JSON.parse(fs.readFileSync(home + '/.aws/impulse.json', 'utf8'));

gulp.task('deploy', ['default'], function() {
    gulp.src(['output/**', '!output/audio/**', '!output/feed.rss'])
        .pipe(gzip())
        .pipe(s3(credentials, { gzippedOnly: true }));

    gulp.src(['output/**/*.mp3', 'output/feed.rss'])
        .pipe(s3(credentials));
});
