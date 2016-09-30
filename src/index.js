#!/usr/bin/env node

var argv = require('yargs').argv;
var glob = require("glob");
var fs = require('fs');
var path = require('path');
var q = require('q');
var prompt = require('cli-prompt');

var extensions = require('../conf/extensions.json');
var directory = argv._[0];
var fileExtensionRE = /\.\w+$/;

var findSimilarPath = require('./findSimilarPath');
var filePathToFileName = require('./filePathToFileName');

if (!directory) {
    return console.error('No directory specified.');
}

function collectRenameCommands(){
    var deferred = q.defer();
    glob(`${directory}/*.*(${extensions.movies.join('|')})`, function (er, movies) {
        glob(`${directory}/*.*(${extensions.subtitles.join('|')})`, function (er, subtitles) {
            var renameCmds = {};
            subtitles.forEach(function(subtitlePath){
                subtitlePath = path.resolve(subtitlePath);
                var similarPath = findSimilarPath(movies, subtitlePath);
                if (similarPath) {
                    var newPath = similarPath.replace(fileExtensionRE, subtitlePath.match(fileExtensionRE)[0]);
                    if (newPath !== subtitlePath) {
                        renameCmds[subtitlePath] = newPath;
                        console.info(`${filePathToFileName(subtitlePath)} > ${filePathToFileName(newPath)}`);
                    }
                } else if (argv.verbose) {
                    console.info(`No similar video file name found for ${filePathToFileName(subtitlePath)}`);
                }
            });
            deferred.resolve(renameCmds);
        });
    });
    return deferred.promise;
}

collectRenameCommands().then(function(renameCmds){
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
