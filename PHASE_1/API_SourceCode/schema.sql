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
  disease     text not null,
  syndrome    text,
  event_date  date,
  location    text
);

create table if not exists Part_Of (
  article_id    id not null,
  report_id     integer not null,
  foreign key   (article_id) references Article(id),
  foreign key   (report_id) references Report(id),
  primary key   (article_id, report_id)
);