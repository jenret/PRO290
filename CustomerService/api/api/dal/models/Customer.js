// User.js

class Customer {
    constructor(id, name, parent_id, address_id, shipping_address_id, primary_contact_id, is_active) {
        this.id = id;
        this.name = name;
        this.parent_id = parent_id;
        this.address_id = address_id;
        this.shipping_address_id = shipping_address_id;
        this.primary_contact_id = primary_contact_id;
        this.is_active = is_active;
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = Customer;