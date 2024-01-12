function checkAuthorisedUser(req,res,next){
    const cookies = req?.cookies;
    
    if(!(cookies && cookies?.token))
        return res.redirect('/login');
    else{
        next();
    }
}
module.exports = checkAuthorisedUser;