-- Schema

create table Article (
  url                   text not null,
  headline              text,
  main_text             text,
  date_of_publication   date,
  primary key           (url)
);

create table Report (
  disease     text not null,
  article     text not null,
  syndrome    text,
  event_date  date,
  location    date,
  primary key (disease)
);