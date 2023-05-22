use master;
--  drop the database
drop database if exists order_management_system;
-- create the database
create database order_management_system;
-- use the database
use order_management_system;
-- user tables
create table users (
    id uniqueidentifier primary key,
    first_name nvarchar(64) not null,
    last_name nvarchar(64) not null,
    email_address nvarchar(256) not null unique,
    phone_number nvarchar(64) not null,
    password nvarchar(256) not null,
    is_verified bit not null,
    is_active bit not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);
-- insert into users (
--         id,
--         first_name,
--         last_name,
--         email_address,
--         phone_number,
--         password,
--         is_verified,
--         is_active,
--         date_created,
--         date_modified
--     )
-- values (
--         '0c9351cb-3591-42fa-bdcd-edc0947959e9',
--         'John',
--         'Doe',
--         'johndoe@example.com',
--         '123-456-7890',
--         'password123',
--         true,
--         true,
--     );
create table roles (
    id uniqueidentifier primary key,
    role_name nvarchar(64) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);
create table user_roles (
    id uniqueidentifier primary key,
    user_id uniqueidentifier not null,
    role_id uniqueidentifier not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (user_id) references users (id) on delete cascade,
    foreign key (role_id) references roles (id) on delete cascade
);
create index user_id_index on user_roles(user_id);
create unique index user_role_index on user_roles(user_id, role_id);
--  customers
create table addresses (
    id uniqueidentifier primary key,
    street_address nvarchar(128) not null,
    street_address_two nvarchar(128) null,
    city nvarchar(128) not null,
    state nvarchar(128) not null,
    zipcode nvarchar(8) not null,
    country nvarchar(64) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);

create table contact_information (
    id uniqueidentifier primary key,
    first_name nvarchar(64) not null,
    last_name nvarchar(64) not null,
    phone_number nvarchar(64) not null,
    email_address nvarchar(256) not null unique,
    is_active bit not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp
);

create table customer_parent (
    id uniqueidentifier primary key,
    name nvarchar(64) not null,
    address_id uniqueidentifier not null,
    contact_id uniqueidentifier not null,
    is_active bit not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (address_id) references addresses (id) on delete cascade,
    foreign key (contact_id) references contact_information (id) on delete cascade
);

create index customer_parent_id_index on customer_parent(id);
create table customer (
    id uniqueidentifier primary key,
    name nvarchar(64) not null,
    parent_id uniqueidentifier not null,
    address_id uniqueidentifier not null,
    shipping_address_id uniqueidentifier not null,
    primary_contact_id uniqueidentifier not null,
    is_active bit not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (parent_id) references contact_information (id) on delete cascade,
    foreign key (address_id) references addresses (id),
    foreign key (shipping_address_id) references addresses (id),
    foreign key (primary_contact_id) references contact_information (id)
);
create index customer_id_index on customer(id);


create table customer_contacts (
    id uniqueidentifier primary key,
    customer_id uniqueidentifier not null,
    contact_id uniqueidentifier not null,
    foreign key (customer_id) references customer (id) on delete cascade,
    foreign key (contact_id) references contact_information (id)
);
--  order management system
create table vendor (
    id uniqueidentifier primary key,
    name nvarchar(64) not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
);
create table vendor_contacts (
    id uniqueidentifier primary key,
    vendor_id uniqueidentifier not null,
    contact_id uniqueidentifier not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
    foreign key (contact_id) references contact_information (id)
);
create table vendor_addresses (
    id uniqueidentifier primary key,
    vendor_id uniqueidentifier not null,
    address_id uniqueidentifier not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
    foreign key (address_id) references addresses (id)
);
create table items (
    id uniqueidentifier primary key,
    name nvarchar(64) not null,
    description nvarchar(128) not null,
    vendor_id uniqueidentifier not null,
    foreign key (vendor_id) references vendor (id) on delete cascade,
);
create index items_id_index on items(id);
create table bill_of_materials (
    id uniqueidentifier primary key,
    parent_item_id uniqueidentifier not null,
    child_item_id uniqueidentifier not null,
    quantity int not null,
    created_by_id uniqueidentifier not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (created_by_id) references users (id) on delete cascade,
    foreign key (parent_item_id) references items (id),
    foreign key (child_item_id) references items (id),
);
create index parent_bill_of_materials_index on bill_of_materials(parent_item_id);
create index child_bill_of_materials_index on bill_of_materials(child_item_id);
create table order_status (
    id int primary key,
    name nvarchar(20) not null
);
create table orders (
    id uniqueidentifier primary key,
    customer_id uniqueidentifier not null,
    order_date datetime not null,
    shipping_date datetime not null,
    notes nvarchar(256) null,
    order_status_id int not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (order_status_id) references order_status (id),
    foreign key (customer_id) references customer (id) on delete cascade
);
create table order_items (
    id uniqueidentifier primary key,
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
create table inventory (
    id uniqueidentifier primary key,
    item_id uniqueidentifier not null,
    quantity int not null,
    date_created datetime default current_timestamp,
    date_modified datetime default current_timestamp,
    foreign key (item_id) references items (id) on delete cascade
);