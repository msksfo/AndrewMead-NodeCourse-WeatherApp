const path = require('path');
const express = require('express');
const app = express();
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
//* process.env.PORT is for heroku
const port = process.env.PORT || 3000;

// 1.  when we work with partials, we need to load in the hbs library
const hbs = require('hbs');
// 2. tell express where to find our partials.
//  a) make a separate folder for the partials & for views
//  b) setup the path to the partials folder
//  c) register the partials
const partialsPath = path.join(__dirname, '../templates/partials');
hbs.registerPartials(partialsPath);

//* the goal is to teach express how to serve up the contents of a static file (index.html, in the public folder)
//  - to do this, we need to supply the path (to index.html, or whatever is the root of the project), but it must be an absolute path, from the root of the machine
//*  - node provides us with 2 variables to find this path
//  -1. __dirname, short for directory name
//  -2.  __filename
//* use path.join(),(a core node module) and pass in the individual pieces of the path (__dirname, and '../public') and it will manipulate the string and return the final path that we need

//* express.static takes the path to what we want to serve up
// app.use() takes the return value of express.static
//! web servers will automatically use index.html when they see '/'

const publicDirectoryPath = path.join(__dirname, '../public');

//* use the hbs npm package to integrate handlebars into an express app
// handlebars is a templating engine, so our pages can be dynamic
// to get up and running with hbs:
// 1. tell express which templating engine we installed, with app.set()
// 2. express expects our templates (our views) to live in a specific folder:
//  - the views folder, in the root of the project (this can be changed, lect. 48)
//  - file extension for handlebars files will be .hbs -> index.hbs
//! index.html could be deleted now, because we will use index.hbs
app.set('view engine', 'hbs');

//* customize the name and location of the views directory
//  - 1. create the new path
//  -2. tell express to use the new path, with app.set()
const viewsPath = path.join(__dirname, '../templates/views');
app.set('views', viewsPath);

//* app.use() has to be placed after all app.set()
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    // render allows us to render a handlebars view
    // 1. pass in the file we want to render. no need for the file extension
    // 2. pass in an object with whatever you want the view to be able to access
    // - node will provide this value to the template and it will be rendered, as so: <h1>{{title}}</h1>
    res.render('index', {
        title: 'Weather App',
        name: 'Tia',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Tia',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'How can I help you?',
        title: 'Help Page',
        name: 'Tia',
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        });
    }
    const address = req.query.address;
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        // if something goes wrong with geocode, use the error in a meaningful way, and do NOT call forecast below, because we wont have the correct data to pass in (the coordinates)

        if (error) {
            return res.send({ error });
        }

        //* pass in the success outcome from geocode
        // latitude, longigute and location are variables defined from the destructred data object in geocode
        forecast(latitude, longitude, (error, forecastData) => {
            // always account for possibiilty of errors
            if (error) {
                res.send({ error });
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address,
            });
        });
    });
});

app.get('/products', (req, res) => {
    // information about the query string lives on request

    //* account for errors/lack of results on the request
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        });
    }

    //console.log(req.query.search);

    res.send({
        products: [],
    });
});

// catch all for help 404's
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help article not found',
        name: 'Tia',
    });
});

// handle all 404 errors
//* '*' will match everything, therefore is HAS to come last
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'That page was not found',
        name: 'Tia',
    });
});

app.listen(port, () => {
    console.log('server is up on port' + port);
});

//* tell nodemon to listen for changes to .js files AND .hbs files
// nodemon src/app.js -e js,hbs
