const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

//* process.env.PORT is for heroku
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

//* Express route handlers
app.get('', (req, res) => {
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
    });
});

app.get('/weather', (req, res) => {
    // account for user not providing an address
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        });
    }

    const address = req.query.address;
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        // if something goes wrong with geocode, do NOT call forecast below, because we wont have the correct data to pass in (the coordinates)

        if (error) {
            return res.send({ error });
        }

        //* pass in the success outcome from geocode
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

// catch all for help 404's
app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'That help article was not found',
    });
});

// handle all 404 errors
//* '*' will match everything, therefore is HAS to come last
app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: 'That page was not found',
    });
});

app.listen(port, () => {
    console.log('server is up on port ' + port);
});

// nodemon src/appNoComments.js -e js,hbs
