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
        res.json({ stories, userID });
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
        res.json({ stories, userID });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/add/:id", (req, res) => {
    let contributionID = req.params.id
    let query = 'SELECT * FROM contributions JOIN stories ON story_id = stories.id WHERE contributions.id = $1;'
    let query2 = 'UPDATE stories SET content = $1 WHERE id = $2;'
    let query3 = 'UPDATE contributions SET active = $1 WHERE story_id = $2;'
    let query4 = `UPDATE contributions SET added = $1 WHERE contributions.id = $2;`
        db.query(query, [contributionID])
      .then(data => {
        let contribution = data.rows[0];
        const newContent = contribution.content +" " + contribution.additions
        const story = contribution.story_id
        db.query(query2, [newContent,story])
        .then(data => {
          let storyis = contribution.story_id
          db.query(query3, [false, contribution.story_id])
          .then(data => {
            db.query(query4, [true,contributionID])
          .then(data => {
            res.redirect(`back`);
      }) })})})
      .catch(err => {
        res
          .json({ error: err.message });
      });
    })

    router.post("/end/:id", (req, res) => {
      let contributionID = req.params.id
      let query = 'SELECT * FROM contributions JOIN stories ON story_id = stories.id WHERE contributions.id = $1;'
      let query2 = 'UPDATE stories SET content = $1 WHERE id = $2;'
      let query3 = 'UPDATE contributions SET active = $1 WHERE story_id = $2;'
      let query4 = `UPDATE contributions SET added = $1 WHERE contributions.id = $2;`
      let query5 = `UPDATE stories SET completed = $1 WHERE id = $2;`
          db.query(query, [contributionID])
        .then(data => {
          let contribution = data.rows[0];
          const newContent = contribution.content +" "+ contribution.additions
          const story = contribution.story_id
          db.query(query2, [newContent,story])
          .then(data => {
            let storyid = contribution.story_id
            db.query(query3, [false,storyid])
            .then(data => {
              db.query(query4, [true,contributionID])
            .then(data => {
              db.query(query5, [true,storyid])
              .then(data => {
              res.redirect(`/users/${storyid}`);
        }) })})})})
        .catch(err => {
          res
            .json({ error: err.message });
        });
      })

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
    let query = `SELECT title, content, completed, users.name, stories.id FROM stories JOIN users ON owner_id = users.id WHERE stories.id = $1 AND owner_id = $2;`;
    let query2 = `SELECT contributions.id, user_id, additions, rating, active, added, name FROM contributions JOIN users ON user_id = users.id WHERE story_id = $1  ORDER BY contributions.id DESC;`;
    let query3 = `SELECT * FROM contributions WHERE story_id = $1 AND active = true;`
    let query4 = `select distinct name from contributions join users on users.id = user_id where added = true and story_id = $1`
    db.query(query, [storyID,userID.user_id])
    .then((data) => {
      stories['story'] = data.rows;

      db.query(query2, [storyID])
      .then((data2) => {
        stories['contributions'] = data2.rows;
        db.query(query3, [storyID])
        .then((data3) => {
          const active = data3.rows;
          db.query(query4, [storyID])
          .then((data4) => {
            const names = data4.rows
        res.render('ownerStory', {stories,names, active, userID})
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
