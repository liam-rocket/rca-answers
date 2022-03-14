-- run script psql -f init_tables.sql <database>
-- psql -d <database> -f init_tables.sql

CREATE TABLE artists (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE collections (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE paintings (id SERIAL PRIMARY KEY, artist_id INTEGER, collection_id INTEGER, name TEXT);

INSERT INTO artists (name) VALUES ('Hans Hofmann'), ('Anne Ryan'), ('Edwin Dickinson');

INSERT INTO collections (name) VALUES ('New York School'), ('Cubism');
