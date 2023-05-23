var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// API REQUIREMENTS
const {
    initialize
} = require("express-openapi");
// const swaggerUi = require('swagger-ui-express')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Allow custom port but default if not found
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Listening on port: " + port));


// Add the path for the API documentation
initialize({
    app,
    apiDoc: require("./api/api-doc"),
    paths: "./api/paths",
});

// app.use(
//     "/api-documentation",
//     swaggerUi.serve,
//     swaggerUi.setup(null, {
//         swaggerOptions: {
//             url: "http://localhost:" + port + "/api-docs"
//         }
//     })
// )

module.exports = app;
