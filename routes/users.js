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
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT *
    FROM stories
    where user_id = ${id}
    `)
    .then(data => {
      const userStories = data.rows;
      res.json({ stories });
    })
    .catch(err => {
      res
      .status(500)
      .json({erroe: err.message});
    });
  });

  router.post("/:id", (req,res)=>{
    db.query(`
    INSERT INTO contributions (story_id, additions)
    VALUES (${id}, ${req.body.additions});
    `)
    .catch(err => {
      res
      .status(500)
      .json({erroe: err.message});
    });
  });
  return router;
};
