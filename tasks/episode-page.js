var gulp = require('gulp'),
    jade = require('jade'),
    changed = require('gulp-changed'),
    replaceExt = require('replace-ext');

const PLUGIN_NAME = 'episodePage';

// Episode Plugin
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

function episodePage(templateName) {
    if (!templateName) {
        throw new PluginError(PLUGIN_NAME, 'Missing template');
    }

    return through.obj(function (file, enc, cb) {
        var templatePath = process.cwd() + '/' + templateName;

        file.path = replaceExt(file.path, '') + '/index.html';

        if (file.isBuffer()) {
            var template = jade.compileFile(templatePath, {
                    filename: templatePath,
                    cache: true,
                    pretty: true
                }),
                data = JSON.parse(String(file.contents));

            file.contents = new Buffer(template(data));

        } else if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        cb(null, file);
    });
}

gulp.task('episode-pages', function() {
   gulp.src('episodes/*.json')
       .pipe(changed('output'))
       .pipe(episodePage('template/episode.jade'))
       .pipe(gulp.dest('output'));
});