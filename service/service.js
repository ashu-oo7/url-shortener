const  jwt = require('jsonwebtoken');
const key = 'ashutosh@123'

async function mapUser(obj){
    let token;
    await jwt.sign(obj,key,(err,tkn)=>{
        if(err)console.log(err);
        else{
            token = tkn;
        }
    });
    return token;
}
function mapKey(token){
    try{
    const obj =  jwt.verify(token,key);
    console.log(obj);
    return obj;
    }
    catch(err){
        return null;
    }
}
module.exports = {
    mapUser,mapKey
}