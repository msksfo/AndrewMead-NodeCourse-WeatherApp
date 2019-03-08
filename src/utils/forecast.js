const request = require('request');

const forecast = (lat, long, callback) => {
    // go to this url via the request module (instead of in the browser window)
    const base = 'https://api.darksky.net/forecast';
    const key = 'b2945a4b0754a3ebd6216bac9ab5da6f';
    const url = `${base}/${key}/${lat},${long}`;

    //* destructure the response object, because the only property we need is 'body'
    request({ url, json: true }, (error, { body }) => {
        // check for low level error by checking for existence of the error object. ( if no error, it will be undefined )
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            // check if the coordinates are not valid
            callback(
                'That location was not found. Try another search.',
                undefined
            );
        } else {
            // this is the successful case (we still have to pass in error, but we know it will be undefined ). grab the data we want
            const currently = body.currently;
            const daily = body.daily;
            callback(
                undefined,
                `${daily.data[0].summary} It is currently ${
                    currently.temperature
                } degrees out. There is a ${currently.precipProbability *
                    100}% chance of rain`
            );
        }
    });
};

/*
forecast('37.8267', '-122.4233', (error, data) => {
    // this is where we have access to the results after the geocode process is complete
    console.log('Error', error);
    console.log('Your forecast summary: ', data);
});
*/

module.exports = forecast;
