import { client } from './initClient.js';

client.connect();

const handleQueryError = (queryError) => {
  console.error('You messed up: ', queryError);
  //   client.end();
};

const handleEmptyResult = () => {
  console.log('no results!');
  //   client.end();
};

const action = process.argv[2];

// BASE
// Create Painting and Add to Collection

if (action === 'new-painting') {
  const [, , , paintingName, artistId, collectionId] = process.argv;

  const query = `INSERT INTO paintings (name, artist_id, collection_id) VALUES ($1, $2, $3) RETURNING *`;
  client.query(
    query,
    [paintingName, artistId, collectionId],
    (error, result) => {
      if (error) {
        handleQueryError(error);
        return;
      }

      if (result.rows.length <= 0) {
        handleEmptyResult();
        return;
      }

      console.log(result.rows[0]);
    }
  );
}

// Get Artists in the Collection

if (action === 'get-artists') {
  const [, , , collectName] = process.argv;

  const query = `
    SELECT *
    FROM collections as c
    INNER JOIN paintings AS p 
    ON p.collection_id = c.id 
    INNER JOIN artists as a 
    ON p.artist_id = a.id 
    WHERE c.name = '${collectName}'
    GROUP BY p.id, c.id ;
  `;

  client.query(query, (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    if (result.rows.length <= 0) {
      handleEmptyResult();
      return;
    }

    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}`);
    });
  });
}

// COMFORTABLE
// Create New Collection and Move Paintings into It

if (action === 'new-collection') {
  const [, , , collectName, ...paintingIds] = process.argv;

  const newCollectionQuery = `INSERT INTO collections (name) VALUES ('${collectName}') RETURNING *`;
  client.query(newCollectionQuery, (error, result) => {
    if (error) {
      handleQueryError(error);
      return;
    }

    if (result.rows.length <= 0) {
      handleEmptyResult();
      return;
    }
    const newCollection = result.rows[0];
    const { id: newCollectionId } = newCollection;

    paintingIds.forEach((paintingId) => {
      const updateQuery = `UPDATE paintings SET collection_id = ${newCollectionId} WHERE id = ${paintingId}`;
      client.query(updateQuery, (error, result) => {
        if (error) {
          handleQueryError(error);
          return;
        }
      });
    });
  });
}

if (action === 'new-painting-mc') {
  const [, , , paintingName, artistName, collectionName] = process.argv;

  const findArtistQuery = `SELECT * FROM artists WHERE name = $1`;

  client.query(
    findArtistQuery,
    [artistName],
    (getArtistError, getArtistResult) => {
      if (getArtistError) {
        handleQueryError(getArtistError);
        return;
      }

      if (getArtistResult.rows.length <= 0) {
        handleEmptyResult();
        return;
      }

      const artist = getArtistResult.rows[0];
      const { id: artistId } = artist;

      const findCollectionQuery = `SELECT * FROM collections WHERE name = $1`;
      client.query(
        findCollectionQuery,
        [collectionName],
        (getCollectionError, getCollectionResult) => {
          if (getCollectionError) {
            handleQueryError(getCollectionError);
            return;
          }

          if (getCollectionResult.rows.length <= 0) {
            handleEmptyResult();
            return;
          }

          const collection = getCollectionResult.rows[0];
          const { id: collectionId } = collection;

          const createPaintingQuery = `INSERT INTO paintings (name, artist_id, collection_id) VALUES ($1, $2, $3)`;
          client.query(
            createPaintingQuery,
            [paintingName, artistId, collectionId],
            (createPaintingError, createPaintingResult) => {
              if (createPaintingError) {
                handleQueryError(createPaintingError);
                return;
              }

              console.log('Created Painting!');
            }
          );
        }
      );
    }
  );
}
