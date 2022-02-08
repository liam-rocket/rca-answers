import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

app.set('view engine', 'ejs');

// * BASE

const getSightings = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    // Obtain data to inject into EJS template
    let data = jsonContentObj.sightings;
    let sortBy = 'Default';

    // * MORE COMFORTABLE

    const availableQueries = [
      'Year',
      'Season',
      'Month',
      'Date',
      'State',
      'Country',
      'Location Details',
      'Nearest Town',
      'Nearest Road',
      'Also Noticed',
      'Other Witness',
      'Other Stories',
      'Time and Conditions',
      'Environment',
      'Report Number',
      'Report Class',
    ];

    if (Object.keys(request.query).length > 0) {
      sortBy = request.query.sortBy;
      let sortKey = sortBy.toUpperCase().replace('_', '_');
      data = data.map((row) => row[sortKey]).sort((a, b) => b - a);
    }

    // Return HTML to client, merging "index" template with supplied data.
    response.render('sightings', {
      sightings: data,
      queries: availableQueries,
      sortBy,
    });
  });
};

// * COMFORTABLE

const getYears = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    const sightings = jsonContentObj.sightings;
    const years = [];

    const filteredYears = sightings.filter((row) => row.YEAR);
    const sortedYears = filteredYears
      .map((row) => row.YEAR)
      .sort((a, b) => b - a);

    sortedYears.forEach((year) => {
      if (!years.includes(year)) years.push(year);
    });

    response.render('years', { years });
  });
};

const getYearSighting = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    const allSightings = jsonContentObj.sightings;
    const year = request.params.year;

    const yearSightings = allSightings.filter((row) => row.YEAR === year);
    response.render('sightings', { sightings: yearSightings });
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

app.get('/', getSightings);
app.get('/years', getYears);
app.get('/year-sighting/:year', getYearSighting);
app.get('/sightings/:index', getSighting);

app.listen(3004);
