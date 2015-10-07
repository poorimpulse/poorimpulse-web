var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    replaceExt = require('replace-ext'),
    jsonList = require('../lib/json-list');

function episodeList(templateName, opts) {
    opts = opts || {};
    opts.outputName = 'episodes';
    return jsonList(templateName, opts, function(file, data) {
        if (!data.published) {
            return undefined;
        }

        data.guid = parseInt(replaceExt(path.basename(file.path), ''));

        if (opts.includeLength) {
            var audioPath = process.cwd() + '/audio/' + data.guid.toString() + '.mp3';
            var stats = fs.statSync(audioPath);
            data.audioLength = stats.size;
        }

        return data;
    });
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
