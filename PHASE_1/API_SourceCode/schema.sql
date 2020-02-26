-- Schema

create table if not exists Article (
  url                   text not null,
  headline              text,
  main_text             text,
  date_of_publication   date,
  primary key           (url)
);

create table if not exists Report (
  id          integer not null,
  disease     text not null,
  syndrome    text,
  event_date  date,
  location    date,
  primary key (id)
);

create table if not exists Part_Of (
  article_url   text not null,
  report_id     integer not null,
  foreign key   (article_url) references Article(url),
  foreign key   (report_id) references Report(id)
);