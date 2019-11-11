const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Client } = require('pg');
const db = require('./utils/database');
const homeRoutes = require('./routes/home');
const catalogRoutes = require('./routes/catalog');
const loginRoutes = require('./routes/login');


const app = express();

const hbs = exphbs.create({
    defaultLayout: 'Main',
    extname: 'hbs'
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));



app.use('/', homeRoutes);
app.use('/catalog', catalogRoutes);
app.use('/login', loginRoutes);


const PORT = process.env.PORT || 3000;

async function start() {

    try {
        await db.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();