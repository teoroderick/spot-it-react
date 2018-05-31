//==========CALL THINGS NEEDED TO BUILD A BACK END SERVER==========
// bring in express for the backend server
const express = require('express');
// bring in axios for use with promises in async operations
const axios = require('axios');
// bring in the 'database' of cards and signs
const cards = require ('./serverDataCards');
const signs = require ('./serverDataSigns');
// nickname the backend server as app
const app = express();

//==========CONSTANT VARIABLES==========================
// const serverPort = 8080;
app.set('port', process.env.PORT || 8080); // call it app.get('port')

//==========SET UP MIDDLEWARE===========================
// to overcome cross origin request error (port 3000 to port 8080)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // add next line to avoid this error: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response. Source: https://stackoverflow.com/questions/39312736/method-delete-is-not-allowed-by-access-control-allow-methods-in-preflight-respon?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

// to be able to handle POST requests which contains a body
app.use(express.urlencoded({ extended : false}));
app.use(express.json());

// declare where are the static files
app.use(express.static('./public'));


//==========SET UP MAIN ENDPOINTS===========================
// cards and objects - does not change, for now
app.get('/cards', (req, res) => {
    res.json(cards);
});

app.get('/signs', (req, res) => {
    res.json(signs);
});


//==========OPEN BACKEND SERVER==================
// open up the backend server
const server = app.listen(app.get('port'), () => {
    console.log('server listening on port ' + server.address().port); //Listening on port 8080
});