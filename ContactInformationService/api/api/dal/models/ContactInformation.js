// User.js

class ContactInformation {
    constructor(id, first_name, last_name, phone_number, email_address) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.email_address = email_address;
        this.date_created = new Date();
        this.date_modified = new Date();
    }
}

module.exports = ContactInformation;