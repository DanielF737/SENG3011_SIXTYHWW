CREATE TABLE IF NOT EXISTS articles (
  id                  integer primary key autoincrement,
  url                 text not null,
  headline            text not null,
  body                text not null,
  date_of_publication date not null
);

CREATE TABLE IF NOT EXISTS reports (
  id         integer primary key autoincrement,
  article_id integer not null,
  diseases   text not null,
  syndromes  text not null,
  event_date date not null,
  country    text not null,
  city       text not null,
  latitude   text not null,
  longitude  text not null,
  foreign key (article_id) references Article(id)
);

CREATE UNIQUE INDEX articles_idx ON articles (url);
CREATE UNIQUE INDEX reports_idx ON reports (diseases, syndromes, event_date, country, city, longitude, latitude);