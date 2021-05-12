//ARCHIVO DE CONFIGURACION DE AUTENTICACION DE USUARIO

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    console.log(req.body)
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        //1era contrasena: es la del formulario y la 2da es la de la base de datos y reotrna true o false

        if (validPassword) {
            done(null, user, req.flash('succes', 'Welcome ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Incorrect password'));
        }
    } else {
        return done(null, false, req.flash('message', 'Username does not exits'))
    }
}));

//a local strategy se le pasa como parametro los campos del formulario de login
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    //si se quiere recibir mas parametros a parte de estos dos se debe colocar el sig parametro
    passReqToCallback: true

}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

//funcion que serializa al user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users where id = ?', [id]);
    done(null, rows[0]);
});