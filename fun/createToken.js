const jwt = require("jsonwebtoken")


 const create_token = async(test,email)=>{

     const token = jwt.sign({ id: test, email: email }, process.env.secritkey);
    
     return token
 }

 module.exports ={ create_token }