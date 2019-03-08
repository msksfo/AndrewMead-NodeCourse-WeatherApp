//* this file is the starting point for the node application
// load express, configure it to serve something up, and then start the server

const express = require('express');

// express IS a function, so we must call it to make a new express application
const app = express();

// tell the express application what you want it to do
//* all of these routes will run on a single server.
//  mySite.com
//  mySite.com/about
//  mySite.com/help
//* app.get() lets us configure what the server should do when someone tries to get the resource at a specific url (should the server send back html, or json, etc)
//  - app.get() takes in two arguments, the route, and a function
//  - in the function we describe what we want to do when someone visits that route (what will be sent back)
//   - the function is called with 2 arguments, an object with info about the incoming request to the server, the response, which contains a bunch of methods allowing us to customise what is sent back

app.get('', (req, res) => {
    // send something back to the requester (the browser? )
    //* send back html, or json data
    res.send('<h1>Welcome To Express</h1>');
});

app.get('/help', (req, res) => {
    res.send({
        name: 'cirrus',
        isCute: true,
    });
});

app.get('/about', (req, res) => {
    res.send('<h2>About My App</h2>');
});

app.get('/weather', (req, res) => {
    res.send({
        forecast: 'Sunny, no chance of rain',
        location: 'SF',
    });
});

//* you only have to set up .listen() once!
app.listen(3000, () => {
    console.log('server is up on port 3000');
});

// use nodemon src/app.js to keep watching for changes
