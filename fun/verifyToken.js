const jwt = require("jsonwebtoken");

const veriy_Token = (req,res,next)=>{

const token = req.headers.token

 if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secritkey);
    req.user = decoded;

    console.log(req.user.id);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }

}


module.exports = { veriy_Token }