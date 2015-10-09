var jade = require('jade'),
    path = require('path'),
    replaceExt = require('replace-ext'),
    through = require('through2'),
    gutil = require('gulp-util'),
    contributors = require('../players.json'),
    PluginError = gutil.PluginError;

var PLUGIN_NAME = 'jsonList';

function jsonList(templateName, opts, fileProcessCallback, finishStreamCallback) {
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
            fileProcessCallback(file, fdata, function (processedData) {
                if (processedData) {
                    data.push(processedData);
                }
                cb();
            });
        } else if (file.isStream()) {
            return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
        } else {
            cb();
        }
    };

    var endStream = function (cb) {
        if (finishStreamCallback) {
            data = finishStreamCallback(data);
        }

        var outputName = opts.outputName || 'data';

        var processedData = {};
        processedData[outputName] = data;
        processedData.contributors = contributors;
        var outputFile = new gutil.File(outputFilename);
        outputFile.contents = new Buffer(template(processedData));
        outputFile.path = outputFilename;

        this.push(outputFile);
        cb();
    };

    return through.obj(cacheData, endStream);
}

module.exports = jsonList;