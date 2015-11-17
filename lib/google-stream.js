var through2 = require('through2'),
    cred = require(process.cwd() + '/.google-sheet-creds.json'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    GoogleSpreadsheet = require('google-spreadsheet');


var key = 'shortname',
    filterValue = 'Yes';

function ProcessRows(data, rows, usedColumns, filter) {
  for (var i = 0; i < rows.length; i++) {
    var keyName = rows[i][key];
    var entry = {};
    if (usedColumns && usedColumns.length > 0) {
      for (var j = 0; j < usedColumns.length; j++) {
        var columnName = usedColumns[j];
        if (rows[i][columnName]) {
          entry[columnName] = rows[i][columnName];
        }
      }
    } else {
      entry = rows[i];
    }

    if (!filter || entry[filter] == filterValue) {
      data[keyName] = entry;
    }
  }
}

function createStream(sheet_id, usedColumns, filter) {
    var spreadsheetStream = through2.obj();
    spreadsheetStream.go = function () {
        var self = this;
        var sheet = new GoogleSpreadsheet(sheet_id);
        sheet.useServiceAccountAuth(cred, function () {

            sheet.getInfo(function (err, info) {
                if (err) {
                    throw new PluginError('google-stream', err);
                }

                var playerSheet = info.worksheets[0];
                var data = {};
                playerSheet.getRows(function (err, rows) {
                    if (err) {
                        throw new PluginError('google-stream', err);
                    }
                    ProcessRows(data, rows, usedColumns, filter);

                    self.write(JSON.stringify(data, null, '  '));
                });
            });
        });
    };
    return spreadsheetStream;
}

module.exports = createStream;