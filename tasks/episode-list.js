var gulp = require('gulp'),
    jade = require('jade'),
    path = require('path'),
    replaceExt = require('replace-ext');

const PLUGIN_NAME = 'episodeList';

// Episode Plugin
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

function episodeList(templateName) {
    if (!templateName) {
        throw new PluginError(PLUGIN_NAME, 'Missing template');
    }

    var data = [];
    var outputFilename = replaceExt(path.basename(templateName), '.html');
    var templatePath = process.cwd() + '/' + templateName;
    var template = jade.compileFile(templatePath, {
        filename: templatePath,
        cache: true,
        pretty: true
    });

    var cacheData = function (file, enc, cb) {
        if (file.isBuffer()) {
            data.push(JSON.parse(String(file.contents)));
        } else if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        }

        cb();
    };

    var endStream = function(cb) {
        var outputFile = new gutil.File(outputFilename);
        outputFile.contents = new Buffer(template({'episodes': data}));
        outputFile.path = outputFilename;

        this.push(outputFile);
        cb();
    };

    return through.obj(cacheData, endStream);
}

gulp.task('episode-list', function() {
   gulp.src('episodes/*.json')
       .pipe(episodeList('template/index.jade'))
       .pipe(gulp.dest('output'));
});