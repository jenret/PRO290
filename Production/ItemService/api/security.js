const sql = require('mssql');
const kafka = require("./api/service/kafka");

class User {
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

    async findByApiKey(apiKey) {
        try {
            if (!apiKey) {
                this.produceKafkaMessage("critital", "findByApiKey", `API key is missing`);

                throw new Error('API key is missing');
            }

            const pool = await sql.connect({
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                server: process.env.DB_HOST,
                database: process.env.DB_NAME,
                options: {
                    encrypt: true, // Enable if using Azure SQL
                    trustServerCertificate: true, // Enable if using Azure SQL
                },
            });

            const result = await pool
                .request()
                .input('apiKey', sql.UniqueIdentifier, apiKey)
                .query('SELECT * FROM users WHERE api_key = @apiKey');

            // Assuming the API key is unique, retrieve the first user from the result
            const user = result.recordset[0];

            // Close the database connection
            await pool.close();

            return user;
        } catch (error) {
            this.produceKafkaMessage("critital", "findByApiKey", `Failed to retrieve user by API key: ${error.message}`);

            throw new Error(`Failed to retrieve user by API key: ${error.message}`);
        }
    }

    // Other methods of the User model...
}

module.exports = User;