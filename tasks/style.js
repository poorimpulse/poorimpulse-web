var gulp = require('gulp'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths;

gulp.task('styles', function () {
    gulp.src(['./sass/*.sass', '!./sass/_*.sass'])
        .pipe(sass({
            includePaths: ['styles'].concat(neat)
        }))
        .pipe(gulp.dest('output/css'));
});