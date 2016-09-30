#!/usr/bin/env node

var argv = require('yargs').argv;
var prompt = require('cli-prompt');

var directory = argv._[0];

if (!directory) {
    return console.error('No directory specified.');
}

var collectRenameCommands = require('./collectRenameCommands');

collectRenameCommands(directory).then(function(renameCmds){
    var filesToRename = Object.keys(renameCmds).length;
    if (filesToRename === 0) {
        console.info('Found no files to rename.');
    } else if (!argv.dryRun) {
        prompt('Type "y" or "yes" to apply the changes: ', function(answer){
            if (answer.match(/^y(es)?$/i)) {
                for (var key in renameCmds) {
                    fs.rename(key, renameCmds[key]);
                }
            }
        });
    }
});
