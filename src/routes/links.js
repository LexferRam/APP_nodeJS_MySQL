const express = require('express');
const router = express.Router();
const pool = require('../database');//hace referencia a la conecction de la base de datos
const { isLoggedIn } = require('../lib/auth')

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    //si se hace una peticion a la ruta 'links/add' por el metodo post se ejecuta lo sig
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id//toma el id de la session del usuario y le agrega la tarea
    };
    await pool.query('INSERT INTO links set ?', [newLink])
    req.flash('success', 'Link saved successfully');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {
        links
    })
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE id = ?', [id]);
    req.flash('success', 'link removed successfully')
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    console.log(links[0])
    res.render('links/edit', {
        link: links[0]
    });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link updated successfully');
    res.redirect('/links');

})

module.exports = router;