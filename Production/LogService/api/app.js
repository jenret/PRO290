var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const Eureka = require('eureka-js-client').Eureka;
const {
    Kafka
} = require('kafkajs');
const BaseConsumer = require('./consumers/BaseConsumer');



var app = express();
require('dotenv').config();
// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());


// Setup Kafka
const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.BROKER_SERVER_ADDRESS]
});


const baseConsumer = new BaseConsumer(kafka);

// Start consumers
baseConsumer.start();

// Eureka client configuration
const client = new Eureka({
    // Application service details
    instance: {
        app: 'logService',
        hostName: 'LogServiceAPI',
        ipAddr: 'LogServiceAPI',
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
    client.getInstancesByAppId('logService', (error, response) => {
        console.log(response);
    });
});

module.exports = app;