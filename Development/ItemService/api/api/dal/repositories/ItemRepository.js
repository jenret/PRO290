// ItemRepository.js
const sql = require('mssql');
const {
    faker
} = require('@faker-js/faker');
const Item = require("../models/Item");

class ItemRepository {
    constructor() {
        this.config = {
            user: 'sa',
            password: 'abc123!!@',
            server: 'localhost',
            database: 'order_management_system',
            options: {
                encrypt: true, // Enable if using Azure SQL
                trustServerCertificate: true, // Enable if using Azure SQL
            },
        };
    }

    // Methods that interact with the item table
    async getItemById(itemId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM items WHERE id = '${itemId}'`);
            const itemData = result.recordset[0];

            if (!itemData) {
                throw new Error('Item not found');
            }

            // Construct and return a Item object
            return new Item(
                itemData.id,
                itemData.name,
                itemData.description
            );
        } catch (error) {
            throw new Error(`Failed to fetch item: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllItems() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM items`;
            const itemsData = result.recordset;

            if (!itemsData) {
                throw new Error('No items found');
            }

            // Construct and return a list of Item objects
            return itemsData.map(itemData => new Item(
                itemData.id,
                itemData.name,
                itemData.description
            ));
        } catch (error) {
            throw new Error(`Failed to fetch all items: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createItem(item) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO items(name, description) VALUES ('${item.name}', '${item.description}')`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateItem(id, item) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE items SET name='${item.name}', description='${item.description}'`, );
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteItem(itemId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM items WHERE id='${itemId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }


    async populateDatabase() {
        // console.log(faker.location.buildingNumber)
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeItem = {
                    name: faker.commerce.product(),
                    description: faker.commerce.productDescription()
                }
                 await sql.query `INSERT INTO items(name, description)  VALUES ('${fakeItem.name}', '${fakeItem.description}')`;
            }
        } catch (error) {
            throw new Error(`Failed to create item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = ItemRepository;