const sql = require('mssql');
const kafka = require("../../service/kafka");
const {
    faker
} = require('@faker-js/faker');
const Item = require("../models/Item");

class ItemRepository {
    constructor() {
        this.config = {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            server: process.env.DB_HOST,
            database: process.env.DB_NAME,
            options: {
                encrypt: true, // Enable if using Azure SQL
                trustServerCertificate: true, // Enable if using Azure SQL
            },
        };
    }

    async produceKafkaMessage(level, type, response) {
        try {
            kafka.produceMessage(level, {
                type: type,
                response: response
            });
        } catch (error) {
            console.error(`Failed to produce Kafka message: ${error.message}`);
        }
    }

    async getItemById(itemId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM items WHERE id = '${itemId}'`);
            const itemData = result.recordset[0];

            this.produceKafkaMessage("info", "getItemById", `${itemId} was retrieved from the database`);

            if (!itemData) {
                throw new Error('Item not found');
            }

            return new Item(
                itemData.id,
                itemData.name,
                itemData.description
            );
        } catch (error) {
            this.produceKafkaMessage("error", "getItemById", `Failed to fetch item: ${error.message}`);
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

            this.produceKafkaMessage("info", "getAllItems", `All items were fetched`);

            if (!itemsData) {
                throw new Error('No items found');
            }

            return itemsData.map(itemData => new Item(
                itemData.id,
                itemData.name,
                itemData.description
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllItems", `Failed to fetch all items`);
            throw new Error(`Failed to fetch all items: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createItem(item) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO items(name, description) VALUES ('${item.name}', '${item.description}')`);

            this.produceKafkaMessage("info", "createItem", `An item was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createItem", `Failed to create item`);
            throw new Error(`Failed to create item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateItem(id, item) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE items SET name='${item.name}', description='${item.description}'`);

            this.produceKafkaMessage("info", "updateItem", `${id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateItem", `Failed to update item`);
            throw new Error(`Failed to update item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteItem(itemId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM items WHERE id='${itemId}'`);

            this.produceKafkaMessage("info", "deleteItem", `${itemId} was removed from the database`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteItem", `Failed to delete item`);
            throw new Error(`Failed to delete item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async populateDatabase() {
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeItem = {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription()
                }
                await sql.query `INSERT INTO items(name, description) VALUES ('${fakeItem.name}', '${fakeItem.description}')`;
            }

            this.produceKafkaMessage("info", "populateDatabase", `Database was populated with dummy data`);
        } catch (error) {
            this.produceKafkaMessage("error", "populateDatabase", `Failed to populate database with dummy data`);
            throw new Error(`Failed to create item: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = ItemRepository;
