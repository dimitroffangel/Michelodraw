const express = require('express');
const app = express();
    
var fs = require('fs'),
    http = require('http'),
    URL = require('URL');

var frontEndFolder = '../Front-End_Side';
var currentPageName = frontEndFolder + '/Pages/drawingGround.html';

function main(){
    app.use(express.static('../Front-End_Side'));

    app.get('/', function(req, res){

        fs.readFile(currentPageName, (err, html) => {
            if(err)
                throw err;
            res.writeHeader(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        });
    });

    app.post('/data', (req, res) => {
        console.log("getting form data");
        console.log(req.route.stack);
    });

    app.get('/register', (req, res) => {
        fs.readFile(frontEndFolder + '/Pages/LoginPage.html', (err, html) =>{
            if(err)
                throw err;
        
            res.writeHeader(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        });
    });
    
    app.listen(1234, () => {
        console.log('Apping the app');
    });

    // var io = require('socket.io')(server);
    
    // io.on('connection', function(socket){
    //     console.info('New client connected (id = ' + socket.id + ').');
    
    //     socket.on('intro', function(){
    //         console.log('wazzaaapp');
    //     });

    //     socket.on('disconnect', function(){
    //         console.log(socket.id + ' has gone');
    //     });
    // });
}

main();