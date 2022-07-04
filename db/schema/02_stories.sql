DROP TABLE IF EXISTS stories CASCADE;

CREATE TABLE stories (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE, --Does not need NOT NULL as it refrenses first database
  creation_time DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT, --Does not need null as it can be empty
  completed BOOLEAN NOT NULL DEFAULT FALSE
);
