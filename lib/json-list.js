var gulp = require('gulp'),
    jade = require('jade'),
    path = require('path'),
    fs = require('fs'),
    replaceExt = require('replace-ext'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

PLUGIN_NAME = 'jsonList'

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
            var processedData = fileProcessCallback(file, fdata);
            if (processedData) {
                data.push(processedData);
            }
            cb();
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
        var outputFile = new gutil.File(outputFilename);
        outputFile.contents = new Buffer(template(processedData));
        outputFile.path = outputFilename;

        this.push(outputFile);
        cb();
    };

    return through.obj(cacheData, endStream);
}

module.exports = jsonList;