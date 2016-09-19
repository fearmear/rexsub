#!/usr/bin/env node

var argv = require('yargs').argv;
var glob = require("glob");
var similar = require('similar');
var fs = require('fs');
var path = require('path');

var extensions = require('./extensions.json');
var directory = argv._[0];
var fileExtensionRE = /\.\w+$/;
var filePathRE = /\/.*\//;
var specialCharsRE = /[!@#\$%\^\&\*\)\(\\[\]+=]+/g;
var spaceLikeCharsRE =  /[_-]/g;
var whiteSpaceRE = /[\s\.]+/g;

if (!directory) {
    throw new Error('No directory specified');
}

function getSimplifiedFileName(filePath){
  return simplifyFileName(getFileName(filePath));
}

function getFileName(filePath){
  return filePath.replace(filePathRE, '');
}

function simplifyFileName(fileName){
  return fileName.replace(fileExtensionRE, '').replace(specialCharsRE, '').replace(spaceLikeCharsRE, ' ').replace(whiteSpaceRE, ' ').trim().toLowerCase();
}

glob(`${directory}/*.*(${extensions.movies.join('|')})`, function (er, movies) {
    glob(`${directory}/*.*(${extensions.subtitles.join('|')})`, function (er, subtitles) {
        subtitles.forEach(function(subtitlePath){
            subtitlePath = path.resolve(subtitlePath);
            var similarMovies = movies.map(function(moviePath){
              moviePath = path.resolve(moviePath);
              return {
                similarity: similar(getSimplifiedFileName(moviePath), getSimplifiedFileName(subtitlePath)),
                moviePath: moviePath
              }
            }).sort(function(a, b){
              return a.similarity > b.similarity ? -1 : 1;
            });
            if (similarMovies && similarMovies[0] && similarMovies[0].similarity > 0) {
                var newPath = similarMovies[0].moviePath.replace(fileExtensionRE, subtitlePath.match(fileExtensionRE)[0]);
                if (!argv.dryRun) {
                    fs.renameSync(subtitlePath, newPath);
                }
                console.log(`${getFileName(subtitlePath)} > ${getFileName(newPath)}`);
            } else {
              console.log(`No similar video file name found for ${getFileName(subtitlePath)}`);
            }
        });
    });
});
