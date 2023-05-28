var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Eureka = require('eureka-js-client').Eureka;

const swaggerUi = require('swagger-ui-express');

const {
    initialize
} = require('express-openapi');

var app = express();
require('dotenv').config();
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());


// OpenAPI initialization
initialize({
    app,
    apiDoc: require("./api/api-doc"),
    paths: './api/paths',
});

// Eureka client configuration
const client = new Eureka({
    // Application service details
    instance: {
        app: 'CustomerInformationService',
        hostName: 'CustomerInformationServiceAPI',
        ipAddr: 'CustomerInformationServiceAPI',
        port: {
            '$': 5000,
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
    console.log(`Listening on port: ${port}`)
    client.getInstancesByAppId('ContactInformationService', (error, response) => {
        console.log(response);
    });
});

// Swagger UI setup
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: "http://localhost:" + port + "/api-docs" // Use relative URL for Docker compatibility
    }
}));


module.exports = app;