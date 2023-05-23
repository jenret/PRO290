-- Create databases
CREATE DATABASE UserServiceDB;
CREATE DATABASE RoleServiceDB;
CREATE DATABASE CustomerServiceDB;
CREATE DATABASE AddressServiceDB;
CREATE DATABASE ContactInformationServiceDB;
CREATE DATABASE OrderServiceDB;
CREATE DATABASE ItemServiceDB;
CREATE DATABASE InventoryServiceDB;

-- Use UserServiceDB
USE UserServiceDB;
-- Create tables for UserService
CREATE TABLE users (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    first_name NVARCHAR(64) NOT NULL,
    last_name NVARCHAR(64) NOT NULL,
    email_address NVARCHAR(256) NOT NULL UNIQUE,
    phone_number NVARCHAR(64) NOT NULL,
    password NVARCHAR(256) NOT NULL,
    is_verified BIT NOT NULL,
    is_active BIT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Use RoleServiceDB
USE RoleServiceDB;
-- Create tables for RoleService
CREATE TABLE roles (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    role_name NVARCHAR(64) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE user_roles (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    user_id UNIQUEIDENTIFIER NOT NULL,
    role_id UNIQUEIDENTIFIER NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);
CREATE INDEX user_id_index ON user_roles(user_id);
CREATE UNIQUE INDEX user_role_index ON user_roles(user_id, role_id);
-- Use CustomerServiceDB
USE CustomerServiceDB;
-- Create tables for CustomerService
CREATE TABLE addresses (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    street_address NVARCHAR(128) NOT NULL,
    street_address_two NVARCHAR(128) NULL,
    city NVARCHAR(128) NOT NULL,
    state NVARCHAR(128) NOT NULL,
    zipcode NVARCHAR(8) NOT NULL,
    country NVARCHAR(64) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contact_information (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    first_name NVARCHAR(64) NOT NULL,
    last_name NVARCHAR(64) NOT NULL,
    phone_number NVARCHAR(64) NOT NULL,
    email_address NVARCHAR(256) NOT NULL UNIQUE,
    is_active BIT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE customer_parent (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    address_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER NOT NULL,
    is_active BIT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES addresses (id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contact_information (id) ON DELETE CASCADE
);
CREATE INDEX customer_parent_id_index ON customer_parent(id);
CREATE TABLE customer (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    parent_id UNIQUEIDENTIFIER NOT NULL,
    address_id UNIQUEIDENTIFIER NOT NULL,
    shipping_address_id UNIQUEIDENTIFIER NOT NULL,
    primary_contact_id UNIQUEIDENTIFIER NOT NULL,
    is_active BIT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES contact_information (id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses (id),
    FOREIGN KEY (shipping_address_id) REFERENCES addresses (id),
    FOREIGN KEY (primary_contact_id) REFERENCES contact_information (id)
);
CREATE INDEX customer_id_index ON customer(id);
CREATE TABLE customer_contacts (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    customer_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer (id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contact_information (id)
);
-- Use OrderServiceDB
USE OrderServiceDB;
-- Create tables for OrderService
CREATE TABLE vendor (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE vendor_contacts (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    vendor_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor (id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contact_information (id)
);
CREATE TABLE vendor_addresses (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    vendor_id UNIQUEIDENTIFIER NOT NULL,
    address_id UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor (id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES addresses (id)
);
CREATE TABLE items (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(64) NOT NULL,
    description NVARCHAR(128) NOT NULL,
    vendor_id UNIQUEIDENTIFIER NOT NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor (id) ON DELETE CASCADE
);
CREATE INDEX items_id_index ON items(id);
CREATE TABLE bill_of_materials (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    parent_item_id UNIQUEIDENTIFIER NOT NULL,
    child_item_id UNIQUEIDENTIFIER NOT NULL,
    quantity INT NOT NULL,
    created_by_id UNIQUEIDENTIFIER NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_item_id) REFERENCES items (id),
    FOREIGN KEY (child_item_id) REFERENCES items (id)
);
CREATE INDEX parent_bill_of_materials_index ON bill_of_materials(parent_item_id);
CREATE INDEX child_bill_of_materials_index ON bill_of_materials(child_item_id);
CREATE TABLE order_status (
    id INT PRIMARY KEY,
    name NVARCHAR(20) NOT NULL
);
CREATE TABLE orders (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    customer_id UNIQUEIDENTIFIER NOT NULL,
    order_date DATETIME NOT NULL,
    shipping_date DATETIME NOT NULL,
    notes NVARCHAR(256) NULL,
    order_status_id INT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_status_id) REFERENCES order_status (id),
    FOREIGN KEY (customer_id) REFERENCES customer (id) ON DELETE CASCADE
);
CREATE TABLE order_items (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    order_id UNIQUEIDENTIFIER NOT NULL,
    item_id UNIQUEIDENTIFIER NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    notes NVARCHAR(256) NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items (id)
);
CREATE TABLE inventory (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    item_id UNIQUEIDENTIFIER NOT NULL,
    quantity INT NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items (id) ON DELETE CASCADE
);