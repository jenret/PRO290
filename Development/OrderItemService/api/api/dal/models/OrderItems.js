// User.js

class OrderItems {
    constructor(id, order_id, item_id, quantity, price, notes) {
        this.id = id;
        this.order_id = order_id;
        this.item_id =item_id;
        this.quantity = quantity;
        this.price = price;
        this.notes = notes; 
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = OrderItems;