var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');

// var helmet = require('helmet');
// var rateLimit = require('express-rate-limit');
// var cors = require('cors');
// const OpenApiValidator = require('express-openapi-validator');


const {
    initialize
} = require('express-openapi');

var app = express();

// Security
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// // Enable CORS
// app.use(cors());

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// GET /api/v1/customers
//app.use("/", indexRouter);

// router.get('/', (req, res) => {
//     // Handle the GET request for customers
//     // Retrieve the customers data and send the response
//     res.json({
//         message: 'GET /api/v1/customers'
//     });
// });

// // Mount the customers router
// app.use('/api/v1/customers', require('./routes/api/v1/customers'));


// OpenAPI initialization
initialize({
    app,
    apiDoc: require("./api/api-doc"),
    paths: './api/paths',
});

// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: require("./api/api-doc"),
//         validateRequests: true, // (default)
//         validateResponses: true, // false by default
//     }),
// );

// Swagger UI setup
app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: "/api-docs" // Use relative URL for Docker compatibility
    }
}));


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

module.exports = app;