// UserRepository.js
const sql = require('mssql');
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

    // Methods that interact with the user table
    async getUserById(userId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`SELECT * FROM users WHERE id = '${userId}'`);
            const userData = result.recordset[0];

            if (!userData) {
                throw new Error('User not found');
            }

            // Construct and return a User object
            return new User(
                userData.id,
                userData.first_name,
                userData.last_name,
                userData.email_address,
                userData.phone_number,
                userData.password
            );
        } catch (error) {
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

            if (!usersData) {
                throw new Error('No users found');
            }

            // Construct and return a list of User objects
            return usersData.map(userData => new User(
                userData.id,
                userData.first_name,
                userData.last_name,
                userData.email_address,
                userData.phone_number,
                userData.password
            ));
        } catch (error) {
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
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async updateUser(id, user) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`UPDATE users SET first_name='${user.first_name}', last_name='${user.last_name}', email_address='${user.email_address}', phone_number='${user.phone_number}', password='${user.password}' WHERE id='${id}'`, );
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to update user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }

    async deleteUser(userId) {
        try {
            await sql.connect(this.config);
            const result = await sql.query(`DELETE FROM users WHERE id='${userId}'`);
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Failed to delete user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }


    async populateDatabase() {
        // console.log(faker.location.buildingNumber)
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
            }
        } catch (error) {
            throw new Error(`Failed to create user: ${error.message}`);
        } finally {
            await sql.close();
        }
    }
}

module.exports = UserRepository;