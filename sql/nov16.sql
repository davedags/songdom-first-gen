create table song (song_id bigint(20) unsigned primary key auto_increment, band int(10) unsigned, title varchar(255) not null default '', url varchar(255) not null default '', lyrics text, created datetime, modified datetime, created_by bigint(20) unsigned, modified_by bigint(20) unsigned, key band_key (band), key band_title_key (band, title), key title_key (title));


create table user (user_id bigint(20) unsigned primary key auto_increment, fullname varchar(255) not null default '', fname varchar(64) not null default '', mi varchar(64) not null default '', lname varchar(64) not null default '', email varchar(255) not null default '', created datetime, modified datetime);


alter table song add suggestions text;

alter table song add keywords varchar(255) not null default '', add key keywords_key (keywords), add key url_key (url);


alter table user add password varchar(255) not null default '';
