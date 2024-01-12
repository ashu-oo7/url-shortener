const express = require('express');
const controller = require('../controllers/controller');
const checkAuthorisedUser = require('../middlewares/middleware');
const {mapKey} = require('../service/service.js')
const connection = require('../db.js')

const router = express.Router();

router.get('/login',(req,res)=>{res.render('login')});

router.get('/signup',(req,res)=>{res.render('signup')});

router.post('/login',controller.loginUser);
router.post('/signup',controller.createUser);

router.get('/user',checkAuthorisedUser,async(req,res)=>{
    const token = req.cookies.token || req.headers || req.query.token;
    
    const val = mapKey(token);

    if(val == null)res.redirect('/login');

    const {name,session_id} = val;
    await connection.query('select * from url where session_id = ?',[session_id],(err,result)=>{
        if(err)console.log(err);
        else{
            res.render('home',{name:name,urls:result});
        }
    })
    
})
router.post('/user',controller.createURL);
router.get('/user/:id',controller.findUrl);
module.exports = router;

