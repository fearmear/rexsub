var glob = require("glob");
var path = require('path');
var q = require('q');
var argv = require('yargs').argv;

var findSimilarPath = require('./findSimilarPath');
var filePathToFileName = require('./filePathToFileName');

var extensions = require('../conf/extensions.json');
var fileExtensionRE = /\.\w+$/;

module.exports = function collectRenameCommands(directory){
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
