use master;
--  drop the database
drop database if exists order_management_system;
-- create the database
create database order_management_system;
-- use the database
use order_management_system;
-- user tables
create table users (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    first_name nvarchar(64) not null,
    last_name nvarchar(64) not null,
    email_address nvarchar(256) not null,
    phone_number nvarchar(64) not null,
    password nvarchar(256) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);
--  customers
create table addresses (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    street_address nvarchar(128) not null,
    street_address_two nvarchar(128) null,
    city nvarchar(128) not null,
    state nvarchar(128) not null,
    zipcode nvarchar(15) not null,
    country nvarchar(64) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);
create table contact_information (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    first_name nvarchar(64) not null,
    last_name nvarchar(64) not null,
    phone_number nvarchar(64) not null,
    email_address nvarchar(256) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);
create table customer (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name nvarchar(64) not null,
    contact_id uniqueidentifier not null,
    address_id uniqueidentifier not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (contact_id) references contact_information (id) on delete cascade,
    foreign key (address_id) references addresses (id),
);
create index customer_id_index on customer(id);
--  order management system
-- create table vendor (
--     id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
--     name nvarchar(64) not null,
--     contact_id uniqueidentifier not null,
--     address_id uniqueidentifier not null,
--     date_created datetime default current_timestamp,
--     date_modified datetime default current_timestamp,
-- );
create table items (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    name nvarchar(64) not null,
    description nvarchar(128) not null,
    -- vendor_id uniqueidentifier not null,
    -- foreign key (vendor_id) references vendor (id) on delete cascade,
);
create index items_id_index on items(id);
create table bill_of_materials (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    parent_item_id uniqueidentifier not null,
    child_item_id uniqueidentifier not null,
    quantity int not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (parent_item_id) references items (id),
    foreign key (child_item_id) references items (id),
);
create index parent_bill_of_materials_index on bill_of_materials(parent_item_id);
create index child_bill_of_materials_index on bill_of_materials(child_item_id);
create table orders (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    customer_id uniqueidentifier not null,
    order_date datetime default current_timestamp,
    notes nvarchar(256) null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (customer_id) references customer (id) on delete cascade
);
create table order_items (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    order_id uniqueidentifier not null,
    item_id uniqueidentifier not null,
    quantity int not null,
    price decimal(10, 2) not null,
    notes nvarchar(256) null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (order_id) references orders (id) on delete cascade,
    foreign key (item_id) references items (id)
);

--LOOK @ DISCORD
-- create table inventory (
--     id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
--     item_id uniqueidentifier not null,
--     quantity int not null,
--     date_created datetime default current_timestamp,
--     date_modified datetime default current_timestamp,
--     foreign key (item_id) references items (id) on delete cascade
-- );