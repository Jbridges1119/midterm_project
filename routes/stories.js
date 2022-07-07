/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const users = require('./users');
const router  = express.Router();

module.exports = (db) => {
  //REQUEST STORY LIST PAGE
  router.get("/", (req, res) => {
    let userID = req.session
    let query = `SELECT * FROM stories ORDER BY stories.id DESC LIMIT 3;`;
    db.query(query)
      .then(data => {
        const stories = data.rows;
        res.render('storyLists', {stories,userID})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //REQUEST 3 STORIES DOWN
  router.get("/listdown/:id", (req, res) => {
    let userID = req.session
    const offset = Number(req.params.id)
    let query = `SELECT * FROM stories ORDER BY stories.id DESC LIMIT 3 OFFSET $1;`;
    db.query(query, [offset])
      .then(data => {
        const stories = data.rows;
        res.json({ stories, userID });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //REQUEST 3 STORIES UP
  router.get("/listup/:id", (req, res) => {
    let userID = req.session
    const offset = Number(req.params.id)
    let query = `SELECT * FROM stories ORDER BY stories.id DESC LIMIT 3 OFFSET $1;`;
    db.query(query, [offset])
      .then(data => {
        const stories = data.rows;

        res.json({ stories, userID });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //GET LIST OF CONTRIBUTIONS
  router.get("/additions/:id", (req, res) => {
    let userID = req.session
    const story_id = Number(req.params.id)
    let query = `SELECT * FROM contributions WHERE story_id = $1 AND active = true ORDER BY id;`;
    db.query(query, [story_id])
      .then(data => {
        const contributions = data.rows;
        res.json({ contributions, userID });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //POST NEW CONTRIBUTION
  router.post("/additions/:id", (req, res) => {
    let userID = req.session.user_id
    const story_id = Number(req.params.id)
    const addition = req.body.text
    let query = `INSERT INTO contributions (story_id, user_id, additions)
    VALUES ($1, $2, $3);`;
    db.query(query, [story_id, userID,addition])
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

    //REQUEST CREATE STORY PAGE
  router.get("/newStory", (req, res) => {
      let userID = req.session
      let query = `SELECT * FROM users WHERE users.id = $1;`;
      db.query(query, [userID.user_id])
        .then(data => {
          const stories = data.rows;
          res.render('createStory', {stories, userID})
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
    });
    //CREATE NEW STORY
  router.post("/newStory", (req, res) => {
      let userID = req.session
      const owner_id = req.session.user_id
      const creation_time = new Date
      const title = req.body.title
      const content = req.body.text
      const completed = false
      let query = `INSERT INTO stories (owner_id, creation_time, title, content, completed)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
      db.query(query, [owner_id, creation_time, title, content, completed])
        .then(data => {
          const contribution = data.rows;
          res.redirect(`/stories/${data.rows[0].id}`)
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        });
      })

  //REQUEST SPECIFIC STORY PAGE
  router.get("/:id", (req, res) => {
    let userID = req.session
    let storyID = req.params.id
    let stories = {}
    let query = `SELECT title, content, completed, users.name, stories.id, owner_id FROM stories JOIN users ON owner_id = users.id WHERE stories.id = $1;`;
    let query2 = `SELECT contributions.id, user_id, additions, rating, active, added, name FROM contributions JOIN users ON user_id = users.id WHERE story_id = $1  ORDER BY contributions.id DESC;`;
    let query3 = `SELECT * FROM contributions WHERE story_id = $1 AND active = true;`
    let query4 = `select distinct name from contributions join users on users.id = user_id where added = true and story_id = $1`
    db.query(query, [storyID])
    .then((data) => {
      stories['story'] = data.rows;

      if(userID.user_id == stories.story[0].owner_id) {
        return res.redirect(`/users/${storyID}`)
        }
      db.query(query2, [storyID])
      .then((data2) => {
        stories['contributions'] = data2.rows;
        db.query(query3, [storyID])
        .then((data3) => {
          const active = data3.rows;
          db.query(query4, [storyID])
          .then((data4) => {
            const names = data4.rows
        res.render('userSingleStory', {stories,names, active, userID})
      })
    })})})
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
