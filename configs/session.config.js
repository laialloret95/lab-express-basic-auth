const expressSession = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = app => {
    app.use (
        expressSession({
            secret: process.env.SESSION_SECRET || 'SECRET',
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: process.env.SESSION_SECURE || false,
                httpOnly: true,
                maxAge: process.env.SESSION_MAX_AGE || 3600000
            },
            store: MongoStore.create ({
                mongoUrl: process.env.MONGO_URL
            })
        })
    )
}