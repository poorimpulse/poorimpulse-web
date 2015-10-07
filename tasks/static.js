var gulp = require('gulp'),
    changed = require('gulp-changed'),
    jade = require('jade'),
    through = require('through2'),
    replaceExt = require('replace-ext'),
    gutil = require('gulp-util'),
    path = require('path'),
    PluginError = gutil.PluginError;

function SimplePage() {
    return through.obj(function (file, enc, cb) {
        if (file.isBuffer()) {
            var template = jade.compile(file.contents, {
                    cache: true,
                    pretty: true,
                    filename: file.path
                });

            var page_id = replaceExt(path.basename(file.path), '');
            file.contents = new Buffer(template({page_id: page_id}));
            file.path = replaceExt(file.path, '/index.html');

        } else if (file.isStream()) {
            return cb(new PluginError('SimplePage', 'Streaming not supported'));
        }

        cb(null, file);
    });
}

gulp.task('static-pages', function () {
    gulp.src('template/static/*.jade')
        .pipe(changed('output'))
        .pipe(SimplePage())
        .pipe(gulp.dest('output'));
});