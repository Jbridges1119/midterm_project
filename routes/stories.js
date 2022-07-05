const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req,res) => {
    db.query(`
    SELECT *
    FROM stories
    `).then(data => {
      const stories = data.rows;
      res.json({ stories });
    })
    .catch(err => {
      res
      .status(500)
      .json({erroe: err.message});
    });
  })

  router.get("/:id", (req, res) => {
    db.query(`
    SELECT *
    FROM stories
    where id = ${id}
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

  router.post("/", (req,res)=>{
    db.query(`
    INSERT INTO stories (owner_id, creation_time, title, content)
    VALUES (${req.body.user_id}, ${Date()}, ${req.body.title}, ${req.body.content} );
    `)
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
}
