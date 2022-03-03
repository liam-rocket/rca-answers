import pg from 'pg';
const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'yickkiuliamleung',
  host: 'localhost',
  database: 'cat_owners', // psql -d cat_owners -f init_tables.sql
  port: 5432,
};

// create the var we'll use
const client = new Client(pgConnectionConfigs);

export default client;
