var gulp = require('gulp'),
    jade = require('jade'),
    path = require('path'),
    fs = require('fs'),
    replaceExt = require('replace-ext');

const PLUGIN_NAME = 'episodeList';

// Episode Plugin
var through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

function episodeList(templateName, opts) {
    if (!templateName) {
        throw new PluginError(PLUGIN_NAME, 'Missing template');
    }

    opts = opts || {};

    var data = [];
    var outputFilename = replaceExt(path.basename(templateName), opts.ext || '.html');
    var templatePath = process.cwd() + '/' + templateName;
    var template = jade.compileFile(templatePath, {
        filename: templatePath,
        cache: true,
        pretty: true
    });

    var cacheData = function (file, enc, cb) {
        if (file.isBuffer()) {
            var fdata = JSON.parse(String(file.contents));
            if (!fdata.published) {
              cb();
              return;
            }

            fdata.guid = replaceExt(path.basename(file.path), '');

            if (opts.includeLength) {
                var audioPath = process.cwd() + '/audio/' + fdata.guid + '.mp3';
                fs.stat(audioPath, function (err, stats) {
                    if (err) {
                        return cb(new PluginError(PLUGIN_NAME, err));
                    }

                    fdata.audioLength = stats.size;
                    data.push(fdata);
                    cb();
                });
            } else {
                data.push(fdata);
                cb();
            }
        } else if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        } else {
            cb();
        }
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

gulp.task('rss', ['episode-audio'], function () {
    gulp.src('episodes/*.json')
        .pipe(episodeList('template/feed.jade', { 'ext': '.rss', 'includeLength': true }))
        .pipe(gulp.dest('output'));
});
