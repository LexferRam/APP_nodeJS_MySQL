module.exports = {

    //rutas que queremos proteger si el usuario no esta logeado
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {//metodo que devuleve un true or false
            return next();
        }
        return res.redirect('/signin');
    },

    //rutas que queremos proteger si el usuario esta logeado
    isNotLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    }
}