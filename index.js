const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const { Client } = require('pg');
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

const client = new Client({
    user: 'client',
    host: '172.16.132.45',
    database: 'client_db',
    password: 'client'
})

client.connect().then(() => {
    console.log("connected")
});



app.use('/', homeRoutes);
app.use('/catalog', catalogRoutes);
app.use('/login', loginRoutes);


const PORT = process.env.PORT || 3000;

function start() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

start();