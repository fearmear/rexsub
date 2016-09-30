var fileExtensionRE = /\.\w+$/;
var specialCharsRE = /[!@#\$%\^\&\*\)\(\\[\]+=]+/g;
var spaceLikeCharsRE =  /[_-]/g;
var whiteSpaceRE = /[\s\.]+/g;
var seasonEpisodeRE = /s(\d+)(\s+)?e(\d+)/g;
var leadingZeroesRE = /0+(\d+)/g;

module.exports = function simplifyFileName(fileName){
    return fileName.replace(fileExtensionRE, '').replace(specialCharsRE, '').replace(spaceLikeCharsRE, ' ')
        .replace(whiteSpaceRE, ' ').replace(seasonEpisodeRE, '$1 $3').replace(leadingZeroesRE, '$1')
        .trim().toLowerCase();
};