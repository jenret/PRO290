// User.js

class Customer {
    constructor(id, name, parent_id, address_id) {
        this.id = id;
        this.name = name;
        this.parent_id = parent_id;
        this.address_id = address_id;
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = Customer;