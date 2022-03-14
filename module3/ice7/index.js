import { client } from './initClient.js';

client.connect();

const handleQueryError = (queryError) => {
  console.error('You messed up: ', queryError);
  client.end();
};

const handleEmptyResult = () => {
  console.log('no results!');
  client.end();
};

const action = process.argv[2];

// const executionAction = (rows) => {
//   rows.forEach((row) => console.log(`${row.id}. ${row.name}`));
// };

// const queryResultHandler = (job) => async (error, result) => {
//   if (error) {
//     handleQueryError(error);
//     return;
//   }
//   if (result.rows.length <= 0) {
//     handleEmptyResult();
//     return;
//   }

//   job(result.rows);
// };

// Output Exercises
if (action === 'exercises') {
  const query = `SELECT * FROM exercises;`;
  client.query(query, (error, result) => {
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
  });

  // Was experimenting with a technique that writes a function that returns a function :P
  // uncomment the line below and executionAction + queryResultHandler to play around
  // client.query(query, queryResultHandler(executionAction));
}

// Create Workouts (With Existing Exercises)
if (action === 'add-workout') {
  const [, , , workoutName, date, ...exerciseIds] = process.argv;

  const inputData = [workoutName, date];
  const insertWorkoutsQuery = `INSERT INTO workouts (name, date) VALUES ($1, $2);`;
  client.query(insertWorkoutsQuery, inputData, (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    const getWorkout = `SELECT * FROM workouts WHERE name = $1 AND date = $2;`;
    client.query(getWorkout, inputData, (error, result) => {
      if (error) {
        handleQueryError(error);
        return;
      }
      if (result.rows.length <= 0) {
        handleEmptyResult();
        return;
      }

      const workout = result.rows[0];
      const workoutId = workout.id;

      exerciseIds.forEach((exerciseId) => {
        const insretExerciseWorkoutsQuery = `INSERT INTO exercise_workouts (exercise_id, workout_id) VALUES ($1, $2);`;
        client.query(
          insretExerciseWorkoutsQuery,
          [workoutId, exerciseId],
          (error) => {
            if (error) {
              handleQueryError(error);
              return;
            }
          }
        );
      });
      console.log('Inserted!');
    });
  });
}

// Get Workouts with Specific Exercise with Exercise ID
if (action === 'get-workouts-by-exercise') {
  const exerciseId = process.argv[3];

  const insertWorkoutsQuery = `
    SELECT * FROM workouts 
    INNER JOIN exercise_workouts 
    ON exercise_workouts.workout_id = workouts.id 
    WHERE exercise_workouts.exercise_id = $1
  `;

  client.query(insertWorkoutsQuery, [exerciseId], (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    if (result.rows.length <= 0) {
      handleEmptyResult();
      return;
    }

    console.log(result.rows);
  });
}

// Comfortable
// Get Workouts with Specific Exercise with Exercise Name
if (action === 'get-workouts-by-exercise-name') {
  const exerciseName = process.argv[3];

  const exerciseQuery = `SELECT * FROM exercises WHERE name = '${exerciseName}';`;
  client.query(exerciseQuery, (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    if (result.rows.length <= 0) {
      handleEmptyResult();
      return;
    }

    const exercise = result.rows[0];
    const { id: exerciseId } = exercise;

    const insertWorkoutsQuery = `SELECT * FROM workouts INNER JOIN exercise_workouts ON exercise_workouts.workout_id = workouts.id WHERE exercise_workouts.exercise_id = $1`;
    client.query(insertWorkoutsQuery, [exerciseId], (error, result) => {
      if (error) {
        handleQueryError(error);
        return;
      }

      if (result.rows.length <= 0) {
        handleEmptyResult();
        return;
      }

      console.log(result.rows);
    });
  });
}

// Save Workouts with Exercise Name
if (action === 'add-workout-comfortable') {
  const [, , , workoutName, date, ...exerciseNames] = process.argv;

  const inputData = [workoutName, date];
  const insertWorkoutsQuery = `INSERT INTO workouts (name, date) VALUES ($1, $2);`;
  client.query(insertWorkoutsQuery, inputData, (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    const selectWorkoutsQuery = `SELECT * FROM workouts WHERE name = $1 AND date = $2;`;
    client.query(selectWorkoutsQuery, inputData, (error, result) => {
      if (error) {
        handleQueryError(error);
        return;
      }
      if (result.rows.length <= 0) {
        handleEmptyResult();
        return;
      }

      const { id: workoutId } = result.rows[0];
      exerciseNames.forEach((exerciseName) => {
        const exerciseQuery = `SELECT * FROM exercises WHERE name = '${exerciseName}';`;
        client.query(exerciseQuery, (error, result) => {
          if (error) {
            handleQueryError(error);
            return;
          }
          if (result.rows.length <= 0) {
            handleEmptyResult();
            return;
          }

          const { id: exerciseId } = result.rows[0];
          const insretExerciseWorkoutsQuery = `INSERT INTO exercise_workouts (exercise_id, workout_id) VALUES ($1, $2);`;
          client.query(
            insretExerciseWorkoutsQuery,
            [workoutId, exerciseId],
            (error) => {
              if (error) {
                handleQueryError(error);
                return;
              }
            }
          );
        });
      });
    });
  });
}

// Comfortable
// Get Workouts with Specific Exercise with Exercise Name
