var gulp = require('gulp'),
    //changed = require('gulp-changed'),
    jade = require('jade'),
    through = require('through2'),
    replaceExt = require('replace-ext'),
    gutil = require('gulp-util'),
    path = require('path'),
    episode_map = require('../contributors.json'),
    supporters = require('../supporters.json'),
    contributors = require('../players.json'),
    PluginError = gutil.PluginError;

function doesMatch(value, key) {
  return value[key] === 'Yes' ? 1 : 0;
}

function sum(a,b) {
  return a+b;
}

function SimplePage() {
    return through.obj(function (file, enc, cb) {
        if (file.isBuffer()) {
            var template = jade.compile(file.contents, {
                    cache: true,
                    pretty: true,
                    filename: file.path
                });

            var keys = Object.keys(supporters);

            var first10 =  keys.map(function(curr) { return doesMatch(supporters[curr], 'first10'); }).reduce(sum),
                first50 = keys.map(function(curr) { return doesMatch(supporters[curr], 'first50'); }).reduce(sum),
                first100 = keys.map(function(curr) { return doesMatch(supporters[curr], 'first100'); }).reduce(sum),
                remaining = keys.length - first10 - first50 - first100;

            var page_id = replaceExt(path.basename(file.path), '');
            file.contents = new Buffer(template({
                page_id: page_id,
                episode_map: episode_map,
                contributors: contributors,
                supporters: supporters,
                first10: first10,
                first50: first50,
                first100: first100,
                remaining: remaining
            }));
            file.path = replaceExt(file.path, '/index.html');

        } else if (file.isStream()) {
            return cb(new PluginError('SimplePage', 'Streaming not supported'));
        }

        cb(null, file);
    });
}

gulp.task('static-pages', ['build-contributors-json', 'build-supporters-json'], function () {
    gulp.src('template/static/*.jade')
        //.pipe(changed('output'))
        .pipe(SimplePage())
        .pipe(gulp.dest('output'));
});

gulp.task('static-files', function () {
    gulp.src('static/*')
        .pipe(gulp.dest('output'));
});