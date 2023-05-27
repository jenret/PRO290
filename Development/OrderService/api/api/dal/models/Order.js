// User.js

class Order {
    constructor(id, customer_id, notes) {
        this.id = id;
        this.customer_id = customer_id;
        this.notes = notes; 
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = Order;