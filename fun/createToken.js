const jwt = require("jsonwebtoken")


 const create_token = async(test,email,isAdmin)=>{

     const token = jwt.sign({ id: test, email: email , isAdmin:isAdmin}, process.env.secritkey);
    
     return token
 }

 module.exports ={ create_token }