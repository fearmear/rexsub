var path = require('path');

var simplifyFileName = require('./simplifyFileName');
var filePathToFileName = require('./filePathToFileName');

function getSimplifiedFileName(filePath){
    return simplifyFileName(filePathToFileName(filePath));
}

module.exports = function findSimilarPath(pathList, comparePath){
    var result = pathList.map(function(pathListItem){
        pathListItem = path.resolve(pathListItem);
        var pathListItemName = getSimplifiedFileName(pathListItem);
        var compareFileName = getSimplifiedFileName(comparePath);
        pathListItemName.split(' ').forEach(function(part){
            part.replace();
        });
        var diff = pathListItemName.replace(new RegExp(compareFileName.split(' ').join('|'), 'g'), '').trim();
        var diff2 = compareFileName.replace(new RegExp(pathListItemName.split(' ').join('|'), 'g'), '').trim();
        var similarity = pathListItemName.length - diff.length + compareFileName.length - diff2.length;
        return {
            similarity: similarity,
            value: pathListItem
        }
    }).sort(function(a, b){
        return a.similarity > b.similarity ? -1 : 1;
    });
    return result && result[0].value;
};