

CREATE TABLE user_hits (
  id            SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id       INT NOT NULL,
  visit_id      SERIAL UNIQUE NOT NULL,
  action_id     SERIAL UNIQUE NOT NULL,
  search_id     INT,
  booking_id    SERIAL UNIQUE,
  hit_time      TIME NOT NULL,
  hit_date      DATE NOT NULL

)

1) create DB schema
2) think about queries to insert
3) how to make node server execute queries (using psql)
4) how to create functions to execute queries from (3)
5) where should those functions (from 4) live?
