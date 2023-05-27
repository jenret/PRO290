const Joi = require('joi'); // import the Joi validation library
const ItemRepository = require('../repositories/ItemRepository');

class ItemService {
    constructor() {
        this.itemRepository = new ItemRepository();
    }

    async getAllItems() {
        return this.itemRepository.getAllItems();
    }

    async getItemById(id) {
        return this.itemRepository.getItemById(id);
    }

    async createItem(itemData) {
        // Define a schema for item data
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required()
        });

        // Validate the itemData against the schema
        const {
            error
        } = schema.validate(itemData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid item data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with creating the item
        return this.itemRepository.createItem(itemData);
    }

    async populateDatabase() {
         return this.itemRepository.populateDatabase();
    }

    async updateItem(id, itemData) {
        const schema = Joi.object({
            name: Joi.string().required(),
            description: Joi.string().required()
        });

        // Validate the itemData against the schema
        const {
            error
        } = schema.validate(itemData);
        if (error) {
            // If validation fails, throw an error
            throw new Error(`Invalid item data: ${error.details[0].message}`);
        }

        // If validation succeeds, proceed with updating the item
        return this.itemRepository.updateItem(id, itemData);
    }

    async deleteItem(id) {
        return this.itemRepository.deleteItem(id);
    }
}

module.exports = ItemService;