const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');//**************************(los asteriscos hacen referencia al modulo flash)
const session = require('express-session');//**************************
const MYSQLStore = require('express-mysql-session');//**************************
const passport = require('passport');//--------------------------------------autenticacion
const { database } = require('./keys');//**************************

//init
const app = express();
require('./lib/passport');//-----------------------------------autenticacion

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',//main es el archivo hbs por defecto y contiene el codigo comun de todas nuestras vistas(es como una master page en aspx(.net))
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//middlewares
app.use(session({//**************************
    secret: 'faztmsqlnode',//**************************
    resave: false,//**************************
    saveUninitialized: false,//**************************
    store: new MYSQLStore(database)//**************************
}));
app.use(flash());//**************************
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());//--------------------------------------autenticacion
app.use(passport.session());//--------------------------------------autenticacion

//global variables
app.use((req, res, next) => {//**************************
    app.locals.success = req.flash('success');//**************************
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();//**************************
});

//routes
app.use(require('./routes/index.js'));//no es necesario colocar index.js ya que es buscado automaticamente
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

//Public
app.use(express.static(path.join(__dirname, 'public')));

//starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port app ${app.get('port')}`);
})