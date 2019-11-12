const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Client } = require('pg');
const db = require('./utils/database');
const homeRoutes = require('./routes/home');
const catalogRoutes = require('./routes/catalog');
const loginRoutes = require('./routes/login');
const profileRoutes = require('./routes/profile');
const fileMiddleware = require('./middleware/file');


const app = express();

const hbs = exphbs.create({
    defaultLayout: 'Main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: false }));


app.use(fileMiddleware.single('img'));


app.use('/', homeRoutes);
app.use('/catalog', catalogRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);


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