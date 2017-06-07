/*
delete from individuals where individuals."deletedAt" is not null;
delete from answers where answers."deletedAt" is not null;
delete from campaigns where campaigns."deletedAt" is not null;
delete from entities where entities."deletedAt" is not null;
delete from styles where styles."deletedAt" is not null;
delete from surveys where surveys."deletedAt" is not null;
alter table individuals drop "deletedAt";
alter table answers drop "deletedAt";
alter table campaigns drop "deletedAt";
alter table entities drop "deletedAt";
alter table styles drop "deletedAt";
alter table surveys drop "deletedAt";
*/
