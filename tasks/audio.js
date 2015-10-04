var gulp = require('gulp'),
    changed = require('gulp-changed'),
    OUTPUT_PATH = 'output/audio';

gulp.task('episode-audio', function () {
    gulp.src('audio/*.mp3')
        .pipe(changed(OUTPUT_PATH))
        .pipe(gulp.dest(OUTPUT_PATH));
});