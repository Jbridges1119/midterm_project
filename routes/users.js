/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  //REQUEST OWNER STORY LIST PAGE
  router.get("/", (req, res) => {
    let userID = req.session
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY stories.id DESC LIMIT 3;`;
    db.query(query, [userID.user_id])
      .then(data => {
        const stories = data.rows;

        res.render('ownerList', {stories, userID})
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //REQUEST 3 OWNER STORIES DOWN
  router.get("/listdown/:id", (req, res) => {
    let userID = req.session
    const offset = Number(req.params.id)
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY stories.id DESC LIMIT 3 OFFSET $2;`;
    db.query(query, [userID.user_id, offset])
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

//REQUEST 3 OWNER STORIES UP
  router.get("/listup/:id", (req, res) => {
    let userID = req.session
    const offset = Number(req.params.id)
    let query = `SELECT * FROM users JOIN stories ON owner_id = users.id WHERE users.id = $1 ORDER BY stories.id DESC LIMIT 3 OFFSET $2;`;
    db.query(query, [userID.user_id, offset])
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
  // POST        /users/story/add/:id      ~Add specific contribution and continue story
  // POST        /users/story/end/:id
  router.post("/add/:id", (req, res) => {
    let storyID = res.body
    console.log(req)
    let contributionID = req.params.id
    let contribution = ""
    let query = `SELECT additions FROM contributions WHERE id = $1`;
    let query2 = `SELECT content FROM stories WHERE `
    db.query(query, [contributionID])
      .then(data => {
        let contribution = data.rows[0].additions;

        // db.query(query, [contributionID])

        // res.redirect( {contribution} )
      })
      .catch(err => {
        res
          .json({ error: err.message });
      });
    })

    // router.post("/end/:id", (req, res) => {
    //   let contributionID = req.params.id
    //   let query = `UPDATE contributions SET rating = rating + 1 WHERE id = $1 RETURNING rating, id;`;
    //   db.query(query, [contributionID])
    //     .then(data => {
    //       const contribution = data.rows;
    //       res.json( {contribution} )
    //     })
    //     .catch(err => {
    //       res
    //         .json({ error: err.message });
    //     });
    //   })
//ADD ONE TO RATING OF SPECIFIC CONTRIBUTION
  router.post("/like/:id", (req, res) => {
    let contributionID = req.params.id
    let query = `UPDATE contributions SET rating = rating + 1 WHERE id = $1 RETURNING rating, id;`;
    db.query(query, [contributionID])
      .then(data => {
        const contribution = data.rows;
        res.json( {contribution} )
      })
      .catch(err => {
        res
          .json({ error: err.message });
      });
    })
//REMOVE 1 FROM RATING OF SPECIFIC CONTRIBUTION
    router.post("/dislike/:id", (req, res) => {
      let contributionID = req.params.id
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
//REQUEST RATING FOR SPECIFIC CONTRIBUTION
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

  //REQUEST OWNER SPECIFIC STORY PAGE
  router.get("/:id", (req, res) => {
    let userID = req.session
    let storyID = req.params.id
    let stories = {}
    let query = `SELECT * FROM stories WHERE stories.id = $1 AND owner_id = $2;`;
    let query2 = `SELECT * FROM contributions WHERE story_id = $1 ORDER BY id DESC;`;
    db.query(query, [storyID,userID.user_id])
    .then((data) => {
      stories['story'] = data.rows;
      // if(userID == stories.story[0].owner_id) {
      //   return res.redirect(`/users/${storyID}`)
      //   }
      db.query(query2, [storyID])
      .then((data2) => {
        stories['contributions'] = data2.rows;
        res.render('ownerStory', {stories, userID})
      })
    })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;

};
