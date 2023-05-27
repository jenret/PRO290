var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

// Error handling
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});

// Allow for custom port but default if not found
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port: ${port}`));

// Swagger UI setup
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: "http://localhost:" + port + "/api-docs" // Use relative URL for Docker compatibility
    }
}));


module.exports = app;