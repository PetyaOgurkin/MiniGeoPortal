const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const expressSession = require('express-session');
const SessionStore = require('express-session-sequelize')(expressSession.Store);
const csrf = require('csurf');
const flash = require('connect-flash');
const db = require('./utils/database');
const homeRoutes = require('./routes/home');
const catalogRoutes = require('./routes/catalog');
const loginRoutes = require('./routes/login');
const administartionRoutes = require('./routes/administration');
const fileMiddleware = require('./middleware/file');
const varMiddleaware = require('./middleware/variables');
const errorHandler = require('./middleware/error');


const app = express();

const hbs = exphbs.create({
    defaultLayout: 'Main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helper')
})

const sequelizeSessionStore = new SessionStore({ db });

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressSession({
    secret: 'secret string',
    store: sequelizeSessionStore,
    resave: false,
    saveUninitialized: false,
}));

app.use(fileMiddleware.single('img'));
app.use(csrf());
app.use(flash());
app.use(varMiddleaware);


app.use('/', homeRoutes);
app.use('/catalog', catalogRoutes);
app.use('/login', loginRoutes);
app.use('/administration', administartionRoutes);


app.use(errorHandler);


const PORT = process.env.PORT || 3000;

async function start() {

    try {
        await db.sync(/* { force: true } */);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();