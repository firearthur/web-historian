var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
// require more modules/folders here!
var httpHealpers = require('./http-helpers');

// var router = {'/': };

exports.handleRequest = function (req, res) {

  if(req.method === 'GET'){ //if its a get request
    if(req.url === '/'){ //index
      archive.sendResponseFromFile(archive.paths.archiveIndex, res);
    } else {
      if(req.url === '/styles.css'){ //styles
        archive.sendResponseFromFile(archive.paths.archiveStyles, res);
      } else if(req.url === '/loading.html') { //loading page 
        archive.sendResponseFromFile(archive.paths.archiveLoading, res);
      } else {  // all other requests

        var site = req.url.slice(1);
        archive.isUrlArchived(site, (isIncluded)=>{

          if(isIncluded){
          archive.sendResponseFromFile(archive.paths.archivedSites + "/" + site, res);
          } else {
            res.writeHead(404 , httpHealpers.headers);
            res.end('file not found');
          }
        });
      }
    }
  } else if(req.method === 'POST'){   //if its a post request
    

    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
      
    });
    req.on('end', function() {     //gather the data
      
      var url = data.slice(4);
      
        archive.isUrlInList(url, (isInList)=>{    
          if(isInList){     //is the url in list?
            archive.isUrlArchived(url, (isIncluded)=>{
            if(isIncluded){   //is the url archived?
  
              res.writeHead(302 , {Location: url});  //redirecting to a GET request on the url we got from user
              res.end();
            } else {   // the url is not archived              
              res.writeHead(302 , {Location: 'loading.html'});  //redirecting to a GET request on the loading page
              res.end();
            }
        })} else {   //the url is not in list
            //add to list
            archive.addUrlToList(url,()=>{});
            res.writeHead(302 , {Location: 'loading.html'});  //redirecting to a GET request on the loading page
            res.end();
          }
        });

    });

  }
  
  
};
