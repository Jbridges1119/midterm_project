/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let userID = req.session.user_id
    console.log(userID)
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY creation_time LIMIT 3;`;
    db.query(query, [userID])
      .then(data => {
        const stories = data.rows;
        res.render('ownerList', {stories})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/listdown/:id", (req, res) => {
    let userID = req.session.user_id
    const offset = Number(req.params.id)
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY creation_time LIMIT 3 OFFSET $2;`;
    db.query(query, [userID, offset])
      .then(data => {
        const stories = data.rows;
        res.json({ stories });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.get("/listup/:id", (req, res) => {
    let userID = req.session.user_id
    const offset = Number(req.params.id)
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY creation_time LIMIT 3 OFFSET $2;`;
    db.query(query, [userID, offset])
      .then(data => {
        const stories = data.rows;
        res.json({ stories });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.get("/:id", (req, res) => {
    let storyID = req.params.id
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE stories.id = $1;` ;
    db.query(query, [storyID])
      .then(data => {
        const stories = data.rows;
        res.render('ownerList', {stories})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });


  router.post("/like/:id", (req, res) => {
    let contributionID = req.params.id
    let query = `UPDATE contributions SET rating = rating + 1 WHERE id = $1;`;
    db.query(query, [contributionID])
      .then(data => {
        const contribution = data.rows;
        res.json( {contribution} )
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    })

    router.post("/dislike/:id", (req, res) => {
      let contributionID = req.params.id
      console.log(contributionID)
      let query = `UPDATE contributions SET rating = rating - 1 WHERE id = $1;`;
      db.query(query, [contributionID])
        .then(data => {
          const contribution = data.rows;
          res.json( {contribution} )
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      })

    router.get("/rating/:id", (req, res) => {
      let contributionID = req.params.id
      let query = `SELECT * FROM contributions WHERE id = $1;`;
      db.query(query, [contributionID])
        .then(data => {
          const contribution = data.rows;
          res.json( {contribution} )
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      })


  return router;

};
