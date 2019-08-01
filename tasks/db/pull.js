var utils = require('shipit-utils');
var path = require('path');
var db = require('../../lib/db');
var prompt = require('../../lib/yesno');

module.exports = function(gruntOrShipit) {
  var task = async function task() {
    var shipit = db(utils.getShipit(gruntOrShipit));
    var dumpFile = shipit.db.dumpFile('remote');
    var remoteDumpFilePath = path.join(shipit.sharedPath || shipit.currentPath, dumpFile);
    var localDumpFilePath = path.join(shipit.config.workspace, dumpFile);

    var download = function download() {
      return shipit.copyFromRemote(remoteDumpFilePath, localDumpFilePath);
    };

    var ok = await prompt({
      question: 'This task is destructive, there is no rollback as of now!\nAre you sure you want to pull remote db into local? (y/n)'
    });
    if (ok) {
      return shipit.db.createDirs()
      .then(function() {
        return shipit.db.dump('remote', remoteDumpFilePath);
      })
      .then(download)
      .then(function() {
        return shipit.db.clean('remote', remoteDumpFilePath, shipit.config.db.cleanRemote);
      })
      .then(function() {
        return shipit.db.load('local', localDumpFilePath);
      })
      .then(function() {
        return shipit.db.clean('local', localDumpFilePath, shipit.config.db.cleanLocal);
      });
    } else {
      shipit.log('... Skip db:pull task!');
    }
  };

  utils.registerTask(gruntOrShipit, 'db:pull:task', task);
};
