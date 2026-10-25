const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
    '/customer',
    session({
        secret: 'fingerprint_customer',
        resave: false,
        saveUninitialized: false
    })
);

// Verify JWT for protected review operations
app.use('/customer/auth/*', function auth(req, res, next) {
    const authorization = req.session.authorization;

    if (!authorization || !authorization.accessToken) {
        return res.status(401).json({
            message: 'Authentication required. Please login.'
        });
    }

    jwt.verify(
        authorization.accessToken,
        'book_review_secret',
        (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid or expired token'
                });
            }

            req.session.username = decoded.username;
            next();
        }
    );
});

const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running on port ' + PORT));