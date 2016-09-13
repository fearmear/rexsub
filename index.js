#!/usr/bin/env node

var argv = require('yargs').argv;
var glob = require("glob");
var FuzzyMatching = require('fuzzy-matching');
var fs = require('fs');

var extensions = require('./extensions.json');
var directory = argv._[0];
var fileExtensionRE = /\.\w+$/;

if (!directory) {
    throw new Error('No directory specified');
}

glob(`${directory}/*.*(${extensions.movies.join('|')})`, function (er, movies) {
    var matcher = new FuzzyMatching(movies);
    glob(`${directory}/*.*(${extensions.subtitles.join('|')})`, function (er, subtitles) {
        subtitles.forEach(function(oldPath){
            var newPath = matcher.get(oldPath).value.replace(fileExtensionRE, oldPath.match(fileExtensionRE)[0]);
            console.log(`${oldPath} > ${newPath}`);
            if (!argv.dryRun) {
                fs.renameSync(oldPath, newPath);
            }
        });
    });
});