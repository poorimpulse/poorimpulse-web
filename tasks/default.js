var gulp = require('gulp');

var default_tasks = [
    'episode-list',
    'episode-pages',
    'rss',
    'static-pages',
    'styles'
];

gulp.task('default', default_tasks);

gulp.task('watch', default_tasks, function () {
    gulp.watch('sass/*.sass', ['styles']);
    gulp.watch('template/_*.jade', [
        'episode-pages', 'episode-list'
    ]);
    gulp.watch('template/episode.jade', ['episode-pages']);
    gulp.watch('template/feed.jade', ['rss']);
    gulp.watch('template/index.jade', ['episode-list']);
    gulp.watch('episodes/*.json', ['episode-pages', 'episode-list', 'rss']);
});