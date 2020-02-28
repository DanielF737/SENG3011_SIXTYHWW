-- Schema

create table if not exists Article (
  id                    integer primary key autoincrement,
  url                   text not null,
  headline              text,
  main_text             text,
  date_of_publication   date
);

create table if not exists Report (
  id          integer primary key autoincrement,
  article_id  integer not null,
  disease     text not null,
  syndrome    text,
  event_date  date,
  location    text,
  foreign key (article_id) references Article(id)
);