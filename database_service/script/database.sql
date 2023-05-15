--  drop the database
drop database if exists order_management_system;
-- create the database
create database order_management_system;
-- use the database
use order_management_system;

-- user tables
create table users
(
    id               uuid primary key,
    first_name       varchar(64)  not null,
    last_name        varchar(64)  not null,
    email_address    varchar(256) not null unique,
    phone_number     varchar(64)  not null,
    password         varchar(256) not null,
    is_verified      bool         not null,
    is_active        bool         not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp
);

create table roles
(
    id               uuid primary key,
    role_name        varchar(64) not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp
);

create table user_roles
(
    id               uuid primary key,
    user_id          uuid not null,
    role_id          uuid not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (role_id) references roles (id) on delete cascade,
    index (user_id),
    unique (user_id, role_id)
);


--  customers
create table addresses
(
    id                 uuid primary key,
    street_address     varchar(128) not null,
    street_address_two varchar(128) null,
    city               varchar(128) not null,
    state              varchar(128) not null,
    zipcode            varchar(8)   not null,
    country            varchar(64)  not null,
    date_created         timestamp default current_timestamp,
    date_modified   timestamp default current_timestamp on update current_timestamp
);

create table contact_information
(
    id               uuid primary key,
    first_name       varchar(64)  not null,
    last_name        varchar(64)  not null,
    phone_number     varchar(15)  not null,
    email_address    varchar(256) not null unique,
    is_active        bool         not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp
);

create table customer_parent
(
    id               uuid primary key,
    name             varchar(64)  not null,
    address_id       uuid         not null,
    phone_number     varchar(15)  not null,
    email_address    varchar(256) not null unique,
    is_active        bool         not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
    foreign key (address_id) references addresses (id) on delete cascade,
    index (id)
);

create table customer
(
    id                  uuid primary key,
    name                varchar(64) not null,
    parent_id           uuid        not null,
    address_id          uuid        not null,
    shipping_address_id uuid        not null,
    primary_contact_id  uuid        not null,
    is_active           bool        not null,
    date_created          timestamp default current_timestamp,
    date_modified    timestamp default current_timestamp on update current_timestamp,
    foreign key (parent_id) references customer_parent (id) on delete cascade,
    foreign key (address_id) references addresses (id) on delete cascade,
    foreign key (shipping_address_id) references addresses (id) on delete cascade,
    foreign key (primary_contact_id) references contact_information (id) on delete cascade,
    index (id),
    index (parent_id)
);

create table customer_contacts
(
    id          uuid primary key,
    customer_id uuid not null,
    contact_id  uuid not null,
    foreign key (customer_id) references customer (id) on delete cascade,
    foreign key (contact_id) references contact_information (id) on delete cascade
);


--  order management system
create table vendor
(
    id               uuid primary key,
    name             varchar(64) not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
);

create table vendor_contacts
(
    id         uuid primary key,
    vendor_id  uuid not null,
    contact_id uuid not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
    foreign key (contact_id) references contact_information (id) on delete cascade
);


create table vendor_addresses
(
    id         uuid primary key,
    vendor_id  uuid not null,
    address_id uuid not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
    foreign key (address_id) references addresses (id) on delete cascade
);

create table items
(
    id          uuid primary key,
    name        varchar(64)  not null,
    description varchar(128) not null,
    vendor_id   uuid         not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
    index (vendor_id)
);

create table bill_of_materials
(
    id               uuid primary key,
    parent_item_id   uuid not null,
    child_item_id    uuid not null,
    quantity         int  not null,
    created_by_id    uuid not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
    foreign key (created_by_id) references users (id) on delete cascade,
    foreign key (parent_item_id) references items (id) on delete cascade,
    foreign key (child_item_id) references items (id) on delete cascade,
    index (parent_item_id, child_item_id)
);

create table orders
(
    id               uuid primary key,
    customer_id      uuid                                                        not null,
    order_date       timestamp                                                   not null,
    shipping_date    datetime                                                    not null,
    notes            varchar(256)                                                null,
    order_status     enum ('not started', 'in progress', 'waiting', 'completed') not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp
);

create table order_items
(
    id               uuid primary key,
    order_id         uuid           not null,
    item_id          uuid           not null,
    quantity         int            not null,
    price            decimal(10, 2) not null,
    notes            varchar(256)   null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
    foreign key (order_id) references orders (id) on delete cascade,
    foreign key (item_id) references items (id) on delete cascade
);

create table inventory
(
    id               uuid primary key,
    item_id          uuid not null,
    quantity         int  not null,
    date_created       timestamp default current_timestamp,
    date_modified timestamp default current_timestamp on update current_timestamp,
    foreign key (item_id) references items (id) on delete cascade
);
