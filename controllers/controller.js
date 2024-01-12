const connection = require('../db.js');
const {nanoid} = require('nanoid');
const shortUniqueId = require('short-unique-id');
const {mapUser,mapKey} = require('../service/service.js')
const crypto = require('crypto')

async function createURL(req,res){
    const token = req.cookies.token;
    const val = mapKey(token);

    if(val == null)res.redirect('/login');
    console.log("val is ",val);
    const {name,session_id} = val;
    
    const uid = new shortUniqueId();
    const shortID = uid.rnd();
    const redirectUrl = req.body.url;
    
    const query = `insert into url values(?,?,?,?)`;
    const values = [session_id,shortID,redirectUrl,0];
    await connection.query(query,values,async(err,result)=>{
        if(err)return res.json({error : err});
        else{
            const query1 = `select * from url where session_id = ?`;
            const values1 = [session_id];
            await connection.query(query1,values1,(err,result)=>{
            if(err)return res.json({error : err});
            else{
                console.log('result ',result);
                return res.render('home',{name : name,message : `${redirectUrl} is inserted `,urls: result})
                }
            })
        }
    })
        
};
async function findUrl(req,res){
    if(!req.body){
        return res.status(500).json({error :"body cannot be empty"});
    }
    console.log('in find url');
    const shortID = req.params['id'];
    const {session_id} = mapKey(req.cookies.token);
    console.log('shortID ',shortID);
    const statement = `SELECT redirecturl,visithistory FROM url WHERE shortID = ? and session_id = ?`;

    await connection.query(statement,[shortID,session_id],async(err,result)=>{
        if(err) return res.status(500).json({error: JSON.stringify(err)});
        else{

            console.log('result is ',result);

            if((!result) || (result.length == 0))
                return res.status(500).json({message: "Url can't be found"});
            

            let timer = parseInt(result[0].visithistory);
            ++timer;
            const statement1 = `update url set visithistory = '${timer}' where shortID = '${shortID}'`;
            await connection.query(statement1,(err,result)=>{
                if(err){
                    return res.status(500).json({error:err});
                }
                else{
                    console.log("VisitHistory Updated");
                }
            });
            return res.redirect(result[0].redirecturl); 
        }
    });
};

async function loginUser(req,res){
    const body = req?.body;

    if(!body)return res.render('login',{message : "body cannot be empty"});

    const name = body?.name;
    const password = body?.password;
    if((!name) || (!password))return res.render('login',{message : "name or password cannot be empty"});

    const qury = `select session_id from users where username = ? and password = ?`;
    const values = [name,password];
    await connection.query(qury, values, async (err, result) => {
        if (err) {
            return res.status(501).json({ error: err });
        }
    
        if (result.length === 0) {
            return res.render('login', { message: 'name or password is wrong' });
        }
    
        session_id = result[0].session_id;
        
        const qury2 = `select * from url where session_id = ?`;
        const value = [session_id];
        await connection.query(qury2, value,async(err,qury2result)=>{
            if(err)return res.json({error : err});
            else{
                const token = await mapUser({name : name,session_id : session_id});
                
                await res.cookie('token',token);
                return res.redirect('/user');
            }
        })
           
    });
    
}
async function createUser(req,res){
    const body = req?.body;
    console.log('in login user',req.body);
    if(!body)return res.render('signup',{message : "body cannot be empty"});

    const name = body?.name;
    const password = body?.password;
    if((!name) || (!password))return res.render('signup',{message : "name or password cannot be empty"});
    const qury1 = `select COUNT(*) as count from users where username = ?`;
    const value = [name];
    await connection.query(qury1,value,async(err,result)=>{
        const count = result[0].count;
        console.log('res length ',count);
        if(err)return res.json({error: err});
        else if(count > 0){
            return res.render('signup',{message : 'Username not available use a different username'});
        }
        else{
            const qury = `insert into users values(?,?,?)`;
            const session_id = nanoid();
            const values = [name,password,session_id];
            await connection.query(qury,values,(err,result)=>{
                if(err){
                    return res.json({error : err});
                }
                else{
                    return res.render('login');
                }
            })
        }
    })
}
module.exports = {createURL,findUrl,loginUser,createUser};