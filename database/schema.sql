CREATE TABLE user_hits (
  hit_id                SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id               INT NOT NULL,
  visit_id              SERIAL UNIQUE NOT NULL,
  action_id             SERIAL UNIQUE NOT NULL REFERENCES actions(action_id),
  search_id             INT,
  listing_id            INT,
  booking_id            SERIAL UNIQUE REFERENCES bookings(booking_id),
  hit_time              TIME NOT NULL,
  hit_date              DATE NOT NULL
);

CREATE TABLE actions (
  action_id             SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_action           VARCHAR(50)
);

CREATE TABLE bookings (
  booking_id            SERIAL UNIQUE NOT NULL PRIMARY KEY,
  listing_id            INT NOT NULL,
  date_booked           DATE NOT NULL,
  check_in              DATE NOT NULL,
  check_out             DATE NOT NULL,
  total_price           MONEY NOT NULL,
  avg_price_per_night   MONEY NOT NULL
);
