var gulp = require('gulp'),
    parseEpisode = require('../lib/parseEpisode'),
    jsonList = require('../lib/json-list');

function episodeList(templateName, opts, limitFunction) {
    opts = opts || {};
    opts.outputName = 'episodes';
    return jsonList(templateName, opts, function(file, data, cb) {
        opts = opts || {};
        parseEpisode(opts.includeLength, file, data, cb);
    }, limitFunction);
}

gulp.task('episode-list', function() {
   gulp.src('episodes/*.json')
       .pipe(episodeList('template/index.jade'))
       .pipe(gulp.dest('output'));
});

gulp.task('rss', ['episode-audio'], function () {
    gulp.src('episodes/*.json')
        .pipe(episodeList('template/feed.jade', { 'ext': '.rss', 'includeLength': true }, function (data) {
            return data.slice(0, 5);
        }))
        .pipe(gulp.dest('output'));
});
