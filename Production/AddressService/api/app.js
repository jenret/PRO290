const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Eureka = require('eureka-js-client').Eureka;
const swaggerUi = require('swagger-ui-express');
const SecurityService = require("./security");
const security = new SecurityService();
const {
    initialize
} = require('express-openapi');

// Create an instance of Express app
const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

// API key verification function
const verifyApiKey = async (req, res, next) => {
    const apiKey = req.header('x-api-key'); // Assuming the API key is sent in the 'x-api-key' header

    try {
        if (!apiKey || apiKey === null || apiKey === "") {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        // Fetch the user from the database based on the API key
        const user = await security.findByApiKey(apiKey); // Implement this function to retrieve the user by API key

        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        // Attach the user object to the request for further processing
        req.user = user;

        next(); // API key is valid, proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
};


app.use(verifyApiKey);

// OpenAPI initialization
initialize({
    app,
    apiDoc: require('./api/api-doc'),
    paths: './api/paths',
    validateSecurity: {
        handlers: {
            verifyApiKey(req, scopes) {
                return verifyApiKey(req)
            }
        }

    },
});

// Eureka client configuration
const client = new Eureka({
    // Application service details
    instance: {
        app: 'addressService',
        hostName: 'AddressServiceAPI',
        ipAddr: 'AddressServiceAPI',
        port: {
            $: 5000,
            '@enabled': 'true',
        },
        vipAddress: 'api',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        // Eureka server details
        host: 'EurekaRegistry',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.logger.level('debug');
client.start();

// Error handling
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});

// Allow for custom port but default if not found
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
    client.getInstancesByAppId('addressService', (error, response) => {
        console.log(response);
    });
});

// Swagger UI setup
app.use(
    '/api-documentation',
    swaggerUi.serve,
    swaggerUi.setup(null, {
        swaggerOptions: {
            url: `http://localhost:${port}/api-docs`,
        },
    })
);



// Export the Express app
module.exports = app;