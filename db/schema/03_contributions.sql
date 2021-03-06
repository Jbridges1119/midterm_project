DROP TABLE IF EXISTS contributions CASCADE;

CREATE TABLE contributions (
  id SERIAL PRIMARY KEY NOT NULL,
  story_id INTEGER REFERENCES stories(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  additions TEXT,
  rating SMALLINT DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  added BOOLEAN NOT NULL DEFAULT FALSE
);
