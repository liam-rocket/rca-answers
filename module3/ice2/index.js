import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

app.set('view engine', 'ejs');

const getSightings = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    // Obtain data to inject into EJS template
    const data = jsonContentObj.sightings;

    // Return HTML to client, merging "index" template with supplied data.
    response.render('sightings', { sightings: data });
  });
};

const getSighting = (request, response) => {
  const index = request.params.index;
  read('data.json', (err, jsonContentObj) => {
    const sighting = jsonContentObj.sightings[index];
    const content = `
    <html>
    <body>
    <h1>YEAR: ${sighting.YEAR}</h1>
    <h1>STATE: ${sighting.STATE}</h1>
    <h1>OBSERVED: ${sighting.OBSERVED}</h1>
    </body>
    </html>
    `;
    response.send(content);
  });
};

app.get('/sightings', getSightings);
app.get('/sightings/:index', getSighting);

app.listen(3004);
