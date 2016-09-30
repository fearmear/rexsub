var filePathRE = /\/.*\//;

module.exports = function filePathToFileName(filePath){
    return filePath.replace(filePathRE, '');
};