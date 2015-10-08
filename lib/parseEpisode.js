var replaceExt = require('replace-ext'),
    fs = require('fs'),
    path = require('path');

module.exports = function (includeLength, file, data) {
    if (!data.published) {
        return undefined;
    }

    data.guid = parseInt(replaceExt(path.basename(file.path), ''));
    data.permalink = '/' + data.guid.toString() + '/';
    data.audio_url = '/audio/' + data.guid.toString() + '.mp3';
    data.story_by.sort();

    if (includeLength) {
        var audioPath = process.cwd() + '/audio/' + data.guid.toString() + '.mp3';
        var stats = fs.statSync(audioPath);
        data.audioLength = stats.size;
    }

    return data;
};