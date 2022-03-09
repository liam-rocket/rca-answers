-- run script psql -f init_tables.sql <database>
-- psql -d <database> -f init_tables.sql

CREATE TABLE exercises (id SERIAL PRIMARY KEY, name TEXT);

CREATE TABLE workouts (id SERIAL PRIMARY KEY, name TEXT, date TEXT);

CREATE TABLE exercise_workouts (id SERIAL PRIMARY KEY, exercise_id INTEGER, workout_id INTEGER);

INSERT INTO exercises (name) VALUES ('squat'), ('leg press'), ('leg extension'), ('wall sit'), ('deadlift'), ('leg curl'); 