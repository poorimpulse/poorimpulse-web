var gulp = require('gulp'),
    s3 = require('gulp-s3'),
    gzip = require('gulp-gzip'),
    fs = require('fs');

var home = process.env.HOME || process.env.USERPROFILE;
var credentials = JSON.parse(fs.readFileSync(home + '/.aws/impulse.json', 'utf8'));

gulp.task('deploy', ['deploy-gzip', 'deploy-feed', 'deploy-images']);

gulp.task('deploy-gzip', ['default'], function() {
    gulp.src(['output/**', '!output/*.png', '!output/audio/**', '!output/feed.rss'])
        .pipe(gzip())
        .pipe(s3(credentials, { gzippedOnly: true }));
});

gulp.task('deploy-images', ['static-files'], function() {
    gulp.src('output/*.png')
        .pipe(s3(credentials), {
           'Cache-Control': 'max-age=604800,no-transform,public'
        });
});

gulp.task('deploy-audio', ['default'], function() {
    gulp.src(['output/**/*.mp3'])
        .pipe(s3(credentials));
});

gulp.task('deploy-feed', ['rss'], function() {
    gulp.src(['output/feed.rss'])
        .pipe(s3(credentials, {
            'Cache-Control': 'max-age=604800, no-transform, public'
        }));
});
