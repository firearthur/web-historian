var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  archiveIndex : path.join(__dirname, '../web/public/index.html'),
  archiveStyles : path.join(__dirname, '../web/public/styles.css')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
    fs.readFile(exports.paths.list, 'utf8', function(err, contents) {
    callback(contents.split('\n'));
  });
  
};

exports.isUrlInList = function(url, callback) {

  fs.readFile(exports.paths.list, 'utf8', function(err, contents) {
    callback(contents.split('\n').includes(url));
  });
  
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + "\n", callback)
  
};

exports.isUrlArchived = function(url, callback) {
  var fixturePath = exports.paths.archivedSites;
  var listOfSiteFiles;
  fs.readdir(fixturePath, function(err, files){
  
    if(err){
      console.log(err);
    }
    callback(files.includes(url));    
  } );
};

exports.downloadUrls = function(urls) {
  let savingPath = exports.archivedSites;
  if(urls){
    urls.forEach((url)=>{
      
      var fd = fs.openSync(savingPath, 'w');
      fs.writeSync(fd, url);
      fs.closeSync(fd);  
    });
  }

};

exports.sendResponseFromFile = function(filePath, response){
  let returnValue = true;
  fs.readFile(filePath, 'utf8', function(err, contents) {
    response.end(contents);
    returnValue = contents || err;
  });

  return returnValue;   
}

// const callback = (err, data) => {
//   if(err) {
//     res.send(500);
//   } else {
//     res.send(201);
//   }
// }

// callback(err);
// callback();