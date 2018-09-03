const express = require('express');    
const fs = require('fs');
const bodyParser = require('body-parser');
const ensureAuthentication = require('connect-ensure-login');

var passport = require('passport');
var Strategy= require('passport-local').Strategy;
  
var cookieParser = require('cookie-parser');
var session = require("express-session");


var frontEndFolder = '../Front-End_Side';
var currentPageName = frontEndFolder + '/Pages/drawingGround.html';

const items = [
    { id: 1, username: 'nikola', password: "1", displayName:'DiffKolyo', loggedIn:false, emails: [ 'diffNik@example.com' ]},    
  { id: 2, username: 'jack', password: 'secret', displayName: 'Jack', loggedIn:false, emails: [ 'jack@example.com' ] }
, { id: 3, username: 'jill', password: 'birthday', displayName: 'Jill', loggedIn:false, emails: [ 'jill@example.com' ] }
];

function openFile(response, fileDirectory, contentType){
    fs.readFile(fileDirectory, (err, data) => {
        if(err)
            throw err;
        
        response.writeHeader(200, {'Content-Type': contentType})
        response.write(data);
        response.end();
    });
}

function findUsername(username){
    for(var i = 0, length = items.length; i < length; i++){
        if(username == items[i].username)
            return true;
    }

    return false;
}

function findEmail(email){
    var hasMatch;
    items.forEach((item) => {
        console.log(item.emails );
        item.emails.forEach((mail) =>{
            if(mail === email){
                hasMatch = true;
                return;
            }

            console.log(mail);
        });

        console.log(hasMatch + ' trying to find a result from the mail match');
        if(hasMatch)
            return;
    });

    return hasMatch;
}

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
            if (!user) { return cb(null, false, {Message:'invalid data'}); }
            if (user.password != password) { return cb(null, false, {Message:'invalid data'}); }
            return cb(null, user);
          });
    }));

    //passport.authenticate('local', {failureFlash: 'Invalid user data'});

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
    
    app.set('views', '../Front-End_Side/views');
    app.set('view engine', 'pug');
    app.use(express.static('../Front-End_Side'));

    //app.use(express.static('../Front-End_Side'));
    app.use(require('morgan')('combined'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

    app.use(passport.initialize());
    app.use(passport.session());
    
    app.get('/', (request, response) => {
            var q = request.query.q,
            page = parseInt(request.query.page, 10) || 1,
            size = parseInt(request.query.size, 10) || 10;
        var result = items;

        if(q){
            q = q.toLowerCase();

            result = result.filter((item) => item.name.toLowerCase().includes(q));
        }
        result = result.slice((page-1)*size, page*size);

        response.send(result);
    });

    app.get('/drawingStudio', ensureAuthentication.ensureLoggedIn(),
            (request, response) => {
                openFile(response, currentPageName, 'text/html');
    });

    app.get('/userProfile', ensureAuthentication.ensureLoggedIn(),
            (request, response) => {
                response.send('Dis be your profile');
    });

    app.get('/register', (request, response) => {
        response.render('register');
    });

    app.post('/register', (request, response) => {
        var userData = request.body;

        console.log(items);

        if(findUsername(userData.username)){
            response.render('register', {failedUsernameMessage:'username already taken'});
            return;
        }

        if(findEmail(userData.email)){
            response.render('register', {failedEmailMessage: 'e-mail already taken'});
            return;            
        }

        items.push({id:items.length+1, username:userData.username, 
                    password:userData.password, emails: [userData.email]});
                    
        console.log(items[items.length-1]);
        response.redirect('login');
    });

    app.get('/login', (request, response) => {
        response.render('logIn');
    });
    
    app.post('/login', passport.authenticate('local', { failureFlash: 'Invalid data',
                                                        failureRedirect: 'logIn',
                                                        successReturnToOrRedirect: '/drawingStudio'}));

    app.get('/api/items', (request, response) => {
        response.send(items);
    });

    app.get('/api/items/:id', (request, response) => {
        console.log(request.params);
        const id = parseInt(request.params.id, 10);
        const item = items.find((item) => item.id === id);

        console.log(id);

        if(!item){
            return response.status(404)
                            .send({error: 'Not found'});
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