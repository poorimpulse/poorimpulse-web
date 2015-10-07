var through2 = require('through2'),
    cred = require(process.cwd() + '/.google-sheet-creds.json'),
    sheet_id = require(process.cwd() + '/.google-sheet-id.json'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    GoogleSpreadsheet = require('google-spreadsheet');

var usedColumns = [
    'doyouwanttobegivencreditforthestoryaspartofthepodcast',
    'howwouldyoulikeyournametoappearinthepodcastepisodenotes',
    'urlforwhereyournameshouldlinkto',
    'gravatarurl'
],
    key = 'shortname',
    filter = 'doyouwanttobegivencreditforthestoryaspartofthepodcast',
    filterValue = 'Yes';

function createStream() {
    var spreadsheetStream = through2.obj();
    spreadsheetStream.go = function () {
        var self = this;
        var sheet = new GoogleSpreadsheet(sheet_id);
        sheet.useServiceAccountAuth(cred, function () {

            sheet.getInfo(function (err, info) {
                if (err) {
                    throw new PluginError('build-player-json', err);
                }

                var playerSheet = info.worksheets[0];
                var data = {};
                playerSheet.getRows(function (err, rows) {
                    if (err) {
                        throw new PluginError('build-player-json', err);
                    }

                    for (var i = 0; i < rows.length; i++) {
                        var keyName = rows[i][key];
                        var entry = {};
                        for (var j = 0; j < usedColumns.length; j++) {
                            var columnName = usedColumns[j];
                            if (rows[i][columnName]) {
                                entry[columnName] = rows[i][columnName];
                            }
                        }

                        if (entry[filter] == filterValue) {
                            data[keyName] = entry;
                        }
                    }

                    self.write(JSON.stringify(data, null, '  '));
                });
            });
        });
    };
    return spreadsheetStream;
}

module.exports = createStream;