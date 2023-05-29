// User.js

class User {
    constructor(id, first_name, last_name, email_address, phone_number, api_key, password) {
        this.id = id;
        this.first_name = first_name,
        this.last_name = last_name,
        this.email_address = email_address,
        this.phone_number = phone_number,
        this.api_key = api_key,
        this.password = password,
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = User;