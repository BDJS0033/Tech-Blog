const path = require('path');
const express = require('express');
const session = require('express-session');
// require ExpressHandlebars - handlebars.js
const exphbs = require('express-handlebars');
// require helpers file
const helpers = require('./utils/helpers');

// creates new express application
const app = express();
// 'production mode' - db connection to server, also allows for connection to Heroku port
const PORT = process.env.PORT || 3001;

// creates instance(s) of ExpressHandlebars - allowing full access to API
const hbs = exphbs.create({ helpers });
// connect to database
const sequelize = require('./config/connection');
const routes = require("./controllers");
// connect the session to Sequelize database
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Express.js middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//to access stylesheet
app.use(express.static(path.join(__dirname, 'public')));
//turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }). then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});