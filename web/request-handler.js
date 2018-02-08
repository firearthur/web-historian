var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!
var httpHealpers = require('./http-helpers');

// var router = {'/': };

exports.handleRequest = function (req, res) {

  if(req.method === 'GET'){ //if its a get request
    if(req.url === '/'){
      archive.sendResponseFromFile(archive.paths.archiveIndex, res);
    } else {
      if(req.url === '/styles.css'){ 
        archive.sendResponseFromFile(archive.paths.archiveStyles, res);
      } else {

        var site = req.url.slice(1);
        archive.isUrlArchived(site, (isIncluded)=>{
          //console.log(isIncluded)
          if(isIncluded){
          archive.sendResponseFromFile(archive.paths.archivedSites + "/" + site, res);
          } else {
            res.writeHead(404 , httpHealpers.headers);
            res.end('file not found');
          }
        });


      }

   
    }
  } else if(req.method === 'POST'){ //if its a post request
    

    var data = '';
    req.on('data', function(chunk) {

      data += chunk;
    });
    req.on('end', function() {
     var useless = function (x){return null;};
      archive.addUrlToList(data.slice(4),useless);
      res.writeHead(302, httpHealpers.headers);
      res.end()
    });

  }
  
   


  //res.end(archive.paths.archiveIndex);
};
