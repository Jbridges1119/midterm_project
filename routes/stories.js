/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM stories ORDER BY creation_time LIMIT 3;`;
    db.query(query)
      .then(data => {
        const stories = data.rows;
        res.render('storyLists', {stories})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/listdown/:id", (req, res) => {
    const offset = Number(req.params.id)
    let query = `SELECT * FROM stories ORDER BY creation_time LIMIT 3 OFFSET $1;`;
    db.query(query, [offset])
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
    const offset = Number(req.params.id)
    let query = `SELECT * FROM stories ORDER BY creation_time LIMIT 3 OFFSET $1;`;
    db.query(query, [offset])
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
    let userID = req.session.user_id
    let storyID = req.params.id
    let stories = {}
    let query = `SELECT * FROM stories WHERE stories.id = $1;`;
    let query2 = `SELECT * FROM contributions WHERE story_id = $1 ORDER BY id;`;
    db.query(query, [storyID])
    .then((data) => {
      stories['story'] = data.rows;
      // if(userID == stories.story[0].owner_id) {
      //   return res.redirect(`/users/${storyID}`)
      //   }
      db.query(query2, [storyID])
      .then((data2) => {
        stories['contributions'] = data2.rows;
        console.log(stories)
        res.render('userSingleStory', {stories})
      })
    })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  router.post("/:id", (req, res) => {
    // console.log(req.body, "WHEREEEE")
    // console.log(req.params.id, "WHEREEEE")
    // let query = `INSERT INTO contributions (story_id, additions, rating)
    // VALUES;`;
    // db.query(query, [contributionID])
    //   .then(data => {
    //     const contribution = data.rows;
    //     res.json( {contribution} )
    //   })
    //   .catch(err => {
    //     res
    //       .status(500)
    //       .json({ error: err.message });
    //   });
    })

  return router;
};
