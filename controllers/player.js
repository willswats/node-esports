import pool from '../data/config.js';

export const getIndexPlayer = (req, res) => {
  pool.query(
    `
  SELECT * 
  FROM player
  `,
    (error, result) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      }
      res.render('pages/player/index', {
        title: 'Players',
        result,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    }
  );
};

export const getAddPlayer = (req, res) => {
  pool.query(
    `
    SELECT *
    FROM game
    `,
    (error, result) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      }
      console.log(result);
      res.render('pages/player/add', {
        title: 'Add Player',
        result,
      });
    }
  );
};
export const postAddPlayer = (req, res) => {
  const { name, email } = req.body;
  let { game_id } = req.body;

  pool.query(
    `
    INSERT INTO player 
    SET ?
    `,
    {
      name,
      email,
    },
    (error, result) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      } else {
        let gameIdsInsert = [];

        // If game_id is not an array, insert it's value into an array
        if (typeof game_id !== 'object') {
          game_id = [game_id];
        }

        for (let i = 0; i < game_id.length; i++) {
          gameIdsInsert.push([result.insertId, game_id[i]]);
        }

        pool.query(
          `
          INSERT INTO 
          gamespecialisation (player_id, game_id) 
          VALUES ?
          `,
          [gameIdsInsert],
          (error) => {
            if (error) {
              req.flash('error', 'Something went wrong');
            } else {
              req.flash('success', 'Added player');
            }
          }
        );
      }
      res.redirect('/players');
    }
  );
};

export const getShowPlayer = (req, res) => {
  const { id } = req.params;

  pool.query(
    `
    SELECT * 
    FROM player 
    WHERE player_id = ?
    `,
    id,
    (error, result) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      }
      res.render('pages/player/show', {
        title: result.length > 0 ? result[0].name : 'Error',
        id,
        result,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    }
  );
};

export const getEditPlayer = (req, res) => {
  const { id } = req.params;

  pool.query(
    `
    SELECT * 
    FROM player 
    WHERE player_id = ?
    `,
    id,
    (error, result) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      }
      res.render('pages/player/edit', {
        title: result.length > 0 ? result[0].name : 'Error',
        id,
        result,
      });
    }
  );
};

export const postEditPlayer = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  pool.query(
    `
    UPDATE player 
    SET ? 
    WHERE player_id = ?
  `,
    [{ name, email }, id],
    (error) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      } else {
        req.flash('success', 'Edited player');
      }
      res.redirect(`/players/${id}`);
    }
  );
};

export const postDeletePlayer = (req, res) => {
  const { id } = req.params;

  pool.query(
    `
  DELETE FROM player 
  WHERE player_id = ?
  `,
    id,
    (error) => {
      if (error) {
        req.flash('error', 'Something went wrong');
      } else {
        req.flash('success', 'Deleted player');
      }
      res.redirect(`/players`);
    }
  );
};
