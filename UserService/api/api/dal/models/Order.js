// User.js

class Order {
    constructor(id, customer_id, street_address_two, city, state, zipcode, country) {
        this.id = id;
        this.street_address = street_address;
        this.street_address_two = street_address_two;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.country = country;
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = Order;