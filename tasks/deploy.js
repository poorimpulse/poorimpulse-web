var gulp = require('gulp'),
    aws = require('gulp-awspublish'),
    merge = require('merge-stream'),
    fs = require('fs');

var home = process.env.HOME || process.env.USERPROFILE;
var credentials = JSON.parse(fs.readFileSync(home + '/.aws/impulse.json', 'utf8'));
var publish = aws.create(credentials);

gulp.task('deploy-episodes', function () {
    var headers = {
        'Cache-Control': 'max-age=315360000, no-transform, public'
    };

    var mp3s = gulp.src('output/audio/*.mp3');
    var pages = gulp.src('output/[0-9]*/index.html')
        .pipe(aws.gzip({ext: '.gz'}));

    merge([mp3s, pages])
        .pipe(publish.publish(headers))
        .pipe(publish.cache())
        .pipe(aws.reporter());
});

gulp.task('deploy-indices', function() {
    gulp.src(['output/*.html', '!output/[0-9]*/index.html'])
        .pipe(aws.gzip({ext: '.gz'}))
        .pipe(publish.publish())
        .pipe(publish.cache())
        .pipe(aws.reporter());
});

gulp.task('deploy', ['default', 'deploy-indices', 'deploy-episodes']);
