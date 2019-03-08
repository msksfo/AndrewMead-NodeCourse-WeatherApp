const request = require('request');

const geocode = (address, callback) => {
    // the callback is what we will call once we have the lat/long coords

    const mapboxUrl =
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
        address +
        '.json?access_token=pk.eyJ1IjoibXNrc2ZvIiwiYSI6ImNqaXN5Z2k3YzB0d2kzeG8xOThiMHRoNHEifQ.afTecEZmT0AQLE7-ZJDOGA';

    request({ url: mapboxUrl, json: true }, (error, { body }) => {
        if (error) {
            // pass the error back to the callback, and let the callback choose what to do. now the code is more flexible
            callback('Unable to connect to location services.');
        } else if (body.message || body.features.length === 0) {
            callback('That location was not found. Try another search.');
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name,
            });
        }
    });
};

/*
geocode('San Francisco', (error, data) => {
    // this is where we have access to the results after the geocode process is complete
    // console.log('Error', error);
    // console.log('data', data);
    console.log(
        `${data.location} coords are ${data.latitude}, ${data.longitude}`
    );
});
*/

module.exports = geocode;
