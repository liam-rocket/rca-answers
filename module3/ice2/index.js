import express from 'express';
import { read } from './jsonFileStorage.js';

const app = express();

app.set('view engine', 'ejs');

const availableQueries = [
  'Year',
  'Season',
  'Month',
  'Date',
  'State',
  'County',
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

// * BASE

const getSightings = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    // Obtain data to inject into EJS template
    let sightingData = jsonContentObj.sightings;
    let sortBy = 'Default';

    // * MORE COMFORTABLE START

    // assign an index to the sighting data that represents their ORIGINAL position
    sightingData = sightingData.map((sighting, index) => ({
      ...sighting,
      index,
    }));

    // only run the below logic if is a query param
    if (Object.keys(request.query).length > 0) {
      // reassign the sortBy value using the query param
      sortBy = request.query.sortBy;

      // transform the sortBy value (ie. Location Details) into the format that is found in the sightings objects (ie. LOCATION_DETAILS)
      let sortKey = sortBy.toUpperCase().replace(' ', '_');

      // sort them in a descending order
      sightingData = sightingData.sort((a, b) => b[sortKey] - a[sortKey]);
    }

    // * MORE COMFORTABLE END

    // Return HTML to client, merging "index" template with supplied data.
    response.render('sightings', {
      sightings: sightingData,
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
    const yearsRange = [];

    // filter out the items that doesn't contain a YEAR value
    const filteredYears = sightings.filter((row) => row.YEAR);

    // sort them in an descending order
    const sortedYears = filteredYears
      .map((row) => row.YEAR)
      .sort((a, b) => b - a);

    // create an array of unique years
    sortedYears.forEach((year) => {
      if (Number(year) && !years.includes(year)) {
        years.push(year);
        return;
      } else if (!Number(year) && !yearsRange.includes(year)) {
        yearsRange.push(year);
      }
    });

    response.render('years', { years });
  });
};

const getYearSighting = (request, response) => {
  read('data.json', (err, jsonContentObj) => {
    const allSightings = jsonContentObj.sightings;
    const year = request.params.year;
    let sortBy = 'Default';

    const yearSightings = allSightings.filter((row) => row.YEAR === year);
    response.render('sightings', {
      sightings: yearSightings,
      sortBy,
      queries: availableQueries,
    });
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
