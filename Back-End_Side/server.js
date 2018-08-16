var fs = require('fs'),
    http = require('http'),
    URL = require('URL');

var frontEndFolder = '../Front-End_Side/';
var currentPageName = frontEndFolder + '/Pages/drawingGround.html';

function main(){

    var server = http.createServer(function(req, res){
        var headers = req.headers,
            method = req.method,
            url = req.url,
            body = [];

        var pathName = URL.parse(url).pathname.toString();
        
        req.on('error', function(err){
            console.log(err);
        }).on('data', function(chunk){
            body.push(chunk);
        }).on('end', function(){
            body = Buffer.concat(body).toString();

            res.on('error', function(err){
                console.log(err);
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.log('Request for ' + pathName + ' recieved');

            if(pathName == '/'){
                fs.readFile(currentPageName, function(err, html){
                    if(err)
                        throw err;
                    
                    res.writeHeader(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();
                });
            }

            if(pathName.substring(pathName.length - 5) == 'html'){
                fs.readFile(frontEndFolder + pathName, function(err, html){
                    if(err)
                        throw err;
                    
                    res.writeHeader(200, {'Content-Type': 'text/html'});
                    res.write(html);
                    res.end();
                });
            }

            if(pathName.substring(pathName.length - 3) == '.js'){
                fs.readFile(frontEndFolder + pathName, function(err, data){
                    if(err)
                        throw err;
                    
                    res.write(data);
                    res.end();
                });
            }

            if(pathName.substring(pathName.length - 4) == '.png' || 
                pathName.substring(pathName.length - 4) == '.jpg'){
                fs.readFile(frontEndFolder + pathName, function(err, data){
                    if(err)
                      throw err;
                    
                    res.write(data);
                    res.end();
                });
            }
        });   
    }).listen(4242);
}

main();