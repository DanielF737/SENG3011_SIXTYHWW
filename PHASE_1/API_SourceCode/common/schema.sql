create table if not exists article (
  id                  integer primary key autoincrement,
  url                 text not null,
  headline            text not null,
  body                text not null,
  date_of_publication date not null
);

create table if not exists report (
  id         integer primary key autoincrement,
  article_id integer not null,
  disease    text not null,
  syndrome   text not null,
  event_date date not null,
  latitude   text not null,
  longitude  text not null
  foreign key (article_id) references Article(id)
);