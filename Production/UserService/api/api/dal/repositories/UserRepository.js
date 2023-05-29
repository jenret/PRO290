const sql = require('mssql');
const kafka = require("../../service/kafka");
const {
    faker
} = require('@faker-js/faker');
const User = require("../models/User");

class UserRepository {
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

    async getUserById(userId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM users WHERE id = '${userId}'`);
            const userData = result.recordset[0];

            this.produceKafkaMessage("info", "getUserById", `User ${userId} was retrieved from the database`);

            if (!userData) {
                throw new Error('User not found');
            }

            return new User(
                userData.id,
                userData.first_name,
                userData.last_name,
                userData.email_address,
                userData.phone_number,
                userData.api_key,
                userData.password
            );
        } catch (error) {
            this.produceKafkaMessage("error", "getUserById", `Failed to fetch user: ${error.message}`);
            throw new Error(`Failed to fetch user: ${error.message}`);
        } finally {
            sql.close();
        }
    }

    async getAllUsers() {
        try {
            await sql.connect(this.config);
            const result = await sql.query `SELECT * FROM users`;
            const usersData = result.recordset;

            this.produceKafkaMessage("info", "getAllUsers", `All users were fetched`);

            if (!usersData) {
                throw new Error('No users found');
            }

            return usersData.map(userData => new User(
                userData.id,
                userData.first_name,
                userData.last_name,
                userData.email_address,
                userData.phone_number,
                userData.api_key,
                userData.password
            ));
        } catch (error) {
            this.produceKafkaMessage("error", "getAllUsers", `Failed to fetch all users: ${error.message}`);
            throw new Error(`Failed to fetch all users: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async createUser(user) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`INSERT INTO users(first_name, last_name, email_address, phone_number, password) VALUES ('${user.first_name}', '${user.last_name}', '${user.email_address}', '${user.phone_number}', '${user.password}')`, {
                first_name: user.first_name,
                last_name: user.last_name,
                email_address: user.email_address,
                phone_number: user.phone_number,
                password: user.password
            });

            this.produceKafkaMessage("info", "createUser", `A user was created`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "createUser", `Failed to create user: ${error.message}`);
            throw new Error(`Failed to create user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateUser(id, user) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE users SET first_name='${user.first_name}', last_name='${user.last_name}', email_address='${user.email_address}', phone_number='${user.phone_number}', password='${user.password}' WHERE id='${id}'`);

            this.produceKafkaMessage("info", "updateUser", `User ${id} was updated`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "updateUser", `Failed to update user: ${error.message}`);
            throw new Error(`Failed to update user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteUser(userId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM users WHERE id='${userId}'`);

            this.produceKafkaMessage("info", "deleteUser", `User ${userId} was deleted`);

            return result.rowsAffected[0] > 0;
        } catch (error) {
            this.produceKafkaMessage("error", "deleteUser", `Failed to delete user: ${error.message}`);
            throw new Error(`Failed to delete user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async populateDatabase() {
        try {
            await sql.connect(this.config);

            for (let i = 0; i < 15; i++) {
                const fakeUser = {
                    first_name: faker.location.street(),
                    last_name: faker.location.secondaryUser(),
                    email_address: faker.location.email_address(),
                    phone_number: faker.location.phone_number(),
                    password: faker.location.password(),
                    country: faker.location.country()
                }
                await sql.query `INSERT INTO users(first_name, last_name, email_address, phone_number, password, country)  VALUES (${fakeUser.first_name}, ${fakeUser.last_name}, ${fakeUser.email_address}, ${fakeUser.phone_number}, ${fakeUser.password}, ${fakeUser.country})`;

                this.produceKafkaMessage("info", "populateDatabase", `User database was populated with fake user: ${fakeUser}`);
            }
        } catch (error) {
            this.produceKafkaMessage("error", "populateDatabase", `Failed to populate user database: ${error.message}`);
            throw new Error(`Failed to create user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = UserRepository;