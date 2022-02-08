import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

const handleIncomingRequest = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    response.send(jsonContentObj);
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

app.get('/', handleIncomingRequest);
app.get('/sightings/:index', getSighting);

app.listen(3004);
