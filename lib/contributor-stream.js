var through = require('through2'),
    gutil = require('gulp-util'),
    parseEpisode = require('./parseEpisode'),
    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'contributorStream';

function contributorStream(opts) {
    opts = opts || {};

    var outputFilename = 'contributors.json';
    var narrators = {};
    var contributors = {};

    var cacheData = function (file, enc, cb) {
        if (file.isBuffer()) {
            var fdata = JSON.parse(String(file.contents));

            if (fdata.published) {
                fdata = parseEpisode(false, file, fdata);

                var episodeEntry = {
                    guid: fdata.guid,
                    title: fdata.title,
                    permalink: fdata.permalink
                };

                var name = fdata.narrated_by;
                narrators[name] = narrators[name] || [];
                narrators[name].push(episodeEntry);

                fdata.story_by.forEach(function (val) {
                    contributors[val] = contributors[val] || [];
                    contributors[val].push(episodeEntry);
                });
            }
            cb();
        } else if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        } else {
            cb();
        }
    };

    var endStream = function (cb) {

        var outputFile = new gutil.File(outputFilename);
        var data = {
            contributors: contributors,
            narrators: narrators
        };
        outputFile.contents = new Buffer(JSON.stringify(data, null, '  '));
        outputFile.path = outputFilename;

        this.push(outputFile);
        cb();
    };

    return through.obj(cacheData, endStream);
}

module.exports = contributorStream;