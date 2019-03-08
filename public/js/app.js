//* this is client side javascript, which will run in the browser
// we will fetch the forecast information with the fetch api (a broswer based api)

const weatherForm = document.querySelector('form');
const locationError = document.querySelector('#location-error');
const locationResult = document.querySelector('#location-result');
const cityState = document.querySelector('#city-state');

weatherForm.addEventListener('submit', e => {
    e.preventDefault();

    locationError.innerHTML = '';
    locationResult.innerHTML = '';
    cityState.innerHTML = '';

    const input = document.querySelector('input');
    const query = input.value.trim();

    const url = `http://localhost:3000/weather?address=${query}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            if (data.error) {
                locationError.innerHTML += data.error;
            } else {
                cityState.innerHTML += `~ ${data.location} ~`;

                locationResult.innerHTML += data.forecast;
            }
        });

    input.value = '';
});
