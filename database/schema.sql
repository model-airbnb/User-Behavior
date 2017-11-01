CREATE TABLE user_hits (
  hit_id                SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id               INT NOT NULL,
  visit_num             INT NOT NULL,
  action_type           VARCHAR(50) NOT NULL,
  search_id             VARCHAR(50),
  listing_id            INT,
  booking_id            INT UNIQUE REFERENCES bookings(booking_id)
);

CREATE TABLE bookings (
  booking_id            SERIAL UNIQUE NOT NULL PRIMARY KEY,
  listing_id            INT NOT NULL,
  check_in              DATE NOT NULL,
  check_out             DATE NOT NULL,
  total_price           MONEY NOT NULL,
  avg_price_per_night   MONEY NOT NULL
);