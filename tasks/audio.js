var gulp = require('gulp'),
    changed = require('gulp-changed');

gulp.task('episode-audio', function () {
    gulp.src('audio/*.mp3')
        .pipe(changed)
        .pipe(gulp.dest('output/audio'));
});