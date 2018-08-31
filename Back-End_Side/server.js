const express = require('express');    
const fs = require('fs');
const bodyParser = require('body-parser');


var passport = require('passport');
var Strategy= require('passport-local').Strategy;
  
var cookieParser = require('cookie-parser');
var session = require("express-session");
  
var frontEndFolder = '../Front-End_Side';
var currentPageName = frontEndFolder + '/Pages/drawingGround.html';

const items = [
    { id: 1, username: 'nikola', password: "1", displayName:'DiffKolyo', loggedIn:false, emails: [ { value: 'diffNik@example.com' } ]},    
  { id: 2, username: 'jack', password: 'secret', displayName: 'Jack', loggedIn:false, emails: [ { value: 'jack@example.com' } ] }
, { id: 3, username: 'jill', password: 'birthday', displayName: 'Jill', loggedIn:false, emails: [ { value: 'jill@example.com' } ] }
];

function findById(id, cb){
    process.nextTick(() =>{
        var idx = id - 1;
        if (items[idx]) {
          cb(null, items[idx]);
        } else {
          cb(new Error('User ' + id + ' does not exist'));
        }
    });
}

function findByUsername(username, cb){
    process.nextTick(() => {
        for (var i = 0, len = items.length; i < len; i++) {
          var record = items[i];
          if (record.username === username) {
            return cb(null, record);
          }
        }
        return cb(null, null);
    });
}

function main(){
    passport.use(new Strategy(
        (username, password, cb) =>{
          console.log('strategizing');
          findByUsername(username, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
          });
    }));

    passport.serializeUser((user, cb) =>{
        console.log('serializing.......');
        cb(null, user.id);
    });
      
    passport.deserializeUser((id, cb) =>{
        findById(id, function (err, user) {
          if (err) { return cb(err); }
        //set the user to loggedOut
            console.log('deserializing.....');
          cb(null, user);
        });
    });
      
    const app = express();
    
    app.use(express.static('../Front-End_Side'));
    app.use(require('morgan')('combined'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    app.get('/', (request, response) =>{
        // var q = request.query.q,
        //     page = parseInt(request.query.page, 10) || 1,
        //     size = parseInt(request.query.size, 10) || 10;
        // var result = items;

        // if(q){
        //     q = q.toLowerCase();

        //     result = result.filter((item) => item.name.toLowerCase().includes(q));
        // }
        // result = result.slice((page-1)*size, page*size);

        // response.send(result);

        fs.readFile(currentPageName, (error, html) => {
            if(error)
                throw error;
            response.writeHeader(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        });
    });


    app.get('/register', (request, response) => {
        fs.readFile(frontEndFolder + '/Pages/LoginPage.html', (err, html) =>{
            if(err)
                throw err;
        
            response.writeHeader(200, {'Content-Type': 'text/html'});
            response.write(html);
            response.end();
        });
    });
    
    app.post('/register', passport.authenticate('local', { failureRedirect: '/register' }),
                (req, res) => {
                console.log('redirecting.......');
                res.redirect('/');
    });

    app.get('/api/items', (request, response) => {
        response.send(items);
    });

    app.get('/api/items/:id', (request, response) => {
        console.log(request.params);
        const id = parseInt(request.params.id, 10);
        const item = items.find((item) => item.id === id);

        console.log(id);

        if(!item){
            return response
                            .status(404)
                            .send({
                                error: 'Not found'
                            });
        }

        return response.send(item);
    });

    app.post('/api/items', (request, response) => {
        console.log(request.body);
        item = request.body;
        item.id = items.length + 1;
        items.push(item);
        
        response
            .status(201)
            .send(item);
    });

    app.listen(1234, () => {
        console.log('Apping the app');
    });
}

main();