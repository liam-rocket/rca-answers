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
      id: index,
    }));

    // only run the below logic if is a query param
    if (Object.keys(request.query).length > 0) {
      // reassign the sortBy value using the query param
      sortBy = request.query.sortBy;

      // transform the sortBy value (ie. Location Details) into the format that is found in the sightings objects (ie. LOCATION_DETAILS)
      let sortKey = sortBy.toUpperCase().replace(' ', '_');

      // filter out naughty item at sightingData[1] 😡
      const filteredSightingData = sightingData.filter((sighting) =>
        Object.values(sighting).every((value) => value)
      );

      // sort them in a descending order
      sightingData = sightingData.sort((a, b) =>
        b[sortKey] > a[sortKey] ? 1 : -1
      );
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

    let sightingDataToShow = '';

    /**
     * Below is my very lazy way of displaying all the sighting metadata available to that sighting (except for OBSERVED)
     * I guess the only way to verify my sorting feature works is by displaying the data of all the available fields
     * It's just a for loop that loops through the sighting object (mind the key <> value pair 😉)
     *
     * The format in which I am outputting the HTML tags is the same as the original version from Gitbook:
     *
     *                       KEY   |   VALUE
     * Liam's way:        ----------------------
     *                  <h1>${key}: ${value}</h1>
     *
     *                       KEY   |   VALUE
     * Gitbook's way:     ----------------------
     *                  <h1>YEAR: ${sighting.YEAR}</h1>
     */

    for (const [key, value] of Object.entries(sighting)) {
      if (key !== null && value !== null) {
        sightingDataToShow += `<h1>${key}: ${value}</h1>`;
      }
    }

    const content = `
      <html>
        <body>
          ${sightingDataToShow}
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

// (a.date_time > b.date_time) ? 1 : -1)

if (a.date_time > b.date_time) {
  return 1;
} else {
  return -1;
}
