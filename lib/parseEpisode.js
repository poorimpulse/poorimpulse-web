var replaceExt = require('replace-ext'),
    fs = require('fs'),
    duration = require('mp3-duration'),
    path = require('path');

function pad(value) {
    var retval = '0' + value.toString();
    return retval.slice(-2);
}

function strDuration(dur) {
    var seconds = Math.ceil(dur) % 60;
    var minutes = Math.floor(dur / 60);
    var hours = 0;
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
    }
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

module.exports = function (includeLength, file, data, cb) {
    if (!data.published) {
        cb(undefined);
        return;
    }

    var guidString = replaceExt(path.basename(file.path), '');
    if (guidString.indexOf('.') >= 0) {
        data.guid = parseFloat(guidString);
    } else {
        data.guid = parseInt(guidString);
    }

    data.permalink = '/' + data.guid.toString() + '/';
    data.audio_url = '/audio/' + data.guid.toString() + '.mp3';
    data.story_by.sort();

    if (includeLength) {
        var audioPath = process.cwd() + '/audio/' + data.guid.toString() + '.mp3';
        var stats = fs.statSync(audioPath);
        data.audioLength = stats.size;

        duration(audioPath, function (err, duration) {
            if (err) {
                console.log(audioPath + ': ' + err.message);
                cb(data);
                return;
            }

            data.duration = strDuration(duration);
            cb(data);
        });
    } else {
        cb(data);
    }
};
