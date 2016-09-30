#!/usr/bin/env node

var argv = require('yargs').argv;
var glob = require("glob");
var fs = require('fs');
var path = require('path');
var q = require('q');
var prompt = require('cli-prompt');

var extensions = require('./extensions.json');
var directory = argv._[0];
var fileExtensionRE = /\.\w+$/;
var filePathRE = /\/.*\//;
var specialCharsRE = /[!@#\$%\^\&\*\)\(\\[\]+=]+/g;
var spaceLikeCharsRE =  /[_-]/g;
var whiteSpaceRE = /[\s\.]+/g;
var seasonEpisodeRE = /s(\d+)(\s+)?e(\d+)/g;
var leadingZeroesRE = /0+(\d+)/g;

if (!directory) {
    return console.error('No directory specified.');
}

function getSimplifiedFileName(filePath){
    return simplifyFileName(getFileName(filePath));
}

function getFileName(filePath){
    return filePath.replace(filePathRE, '');
}

function simplifyFileName(fileName){
    return fileName.replace(fileExtensionRE, '').replace(specialCharsRE, '').replace(spaceLikeCharsRE, ' ')
        .replace(whiteSpaceRE, ' ').replace(seasonEpisodeRE, '$1 $3').replace(leadingZeroesRE, '$1')
        .trim().toLowerCase();
}

function collectRenameCommands(){
    var deferred = q.defer();
    glob(`${directory}/*.*(${extensions.movies.join('|')})`, function (er, movies) {
        glob(`${directory}/*.*(${extensions.subtitles.join('|')})`, function (er, subtitles) {
            var renameCmds = {};
            subtitles.forEach(function(subtitlePath){
                subtitlePath = path.resolve(subtitlePath);
                var similarMovies = movies.map(function(moviePath){
                    moviePath = path.resolve(moviePath);
                    var movieName = getSimplifiedFileName(moviePath);
                    var subtitleName = getSimplifiedFileName(subtitlePath);
                    movieName.split(' ').forEach(function(part){
                        part.replace();
                    });
                    var diff = movieName.replace(new RegExp(subtitleName.split(' ').join('|'), 'g'), '').trim();
                    var diff2 = subtitleName.replace(new RegExp(movieName.split(' ').join('|'), 'g'), '').trim();
                    var similarity = movieName.length - diff.length + subtitleName.length - diff2.length;
                    return {
                        similarity: similarity,
                        moviePath: moviePath
                    }
                }).sort(function(a, b){
                    return a.similarity > b.similarity ? -1 : 1;
                });
                if (similarMovies && similarMovies[0] && similarMovies[0].similarity > 0) {
                    var newPath = similarMovies[0].moviePath.replace(fileExtensionRE, subtitlePath.match(fileExtensionRE)[0]);
                    if (newPath !== subtitlePath) {
                        renameCmds[subtitlePath] = newPath;
                        console.info(`${getFileName(subtitlePath)} > ${getFileName(newPath)}`);
                    }
                } else if (argv.verbose) {
                    console.info(`No similar video file name found for ${getFileName(subtitlePath)}`);
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
