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

create table if not exists Diseases (
  disease     text not null,
  primary key (disease)
);

create table if not exists Syndromes (
  id          integer primary key autoincrement,
  syndrome    text not null
);

create table if not exists Users (
  id          integer primary key autoincrement,
  name        text not null,
  username    text not null, 
  password    text not null,
  email       text not null,
  phone       text
);

create table if not exists SubbedDiseases (
  user_id     integer not null,
  disease     text not null,
  primary key (user_id, disease),
  foreign key (user_id) references Users(id),
  foreign key (disease) references Diseases(disease)
);