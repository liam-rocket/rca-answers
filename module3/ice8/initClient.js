import pg from 'pg';
const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'yickkiuliamleung',
  host: 'localhost',
  database: 'museum',
  port: 5432,
};

// create the var we'll use
export const client = new Client(pgConnectionConfigs);

const handleQueryError = (queryError) => {
  console.error('You messed up: ', queryError);
  client.end();
};

const handleEmptyResult = () => {
  console.log('no results!');
  client.end();
};

export const read = (error, result) => {
  if (error) {
    handleQueryError(error);
    return;
  }

  if (result.rows.length <= 0) {
    handleEmptyResult();
    return;
  }

  const rows = result.rows;
  rows.forEach((row) => console.log(`${row.id}. ${row.name}`));
};

export const insert = (error, result) => {
  console.log(result);
  if (error) {
    handleQueryError(error);
    return;
  }

  if (result.rows.length <= 0) {
    handleEmptyResult();
    return;
  }
};

export const get = (error, result) => {
  // if (error) {
  //   handleQueryError(error);
  //   return;
  // }

  // if (result.rows.length <= 0) {
  //   handleEmptyResult();
  //   return;
  // }

  return result.rows;
};

// export default client;
