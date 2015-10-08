var gulp = require('gulp'),
    parseEpisode = require('../lib/parseEpisode'),
    jsonList = require('../lib/json-list');

function episodeList(templateName, opts) {
    opts = opts || {};
    opts.outputName = 'episodes';
    return jsonList(templateName, opts, function(file, data) {
        opts = opts || {};
        return parseEpisode(opts.includeLength, file, data);
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
