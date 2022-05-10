const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, 'this is dummy text');
        console.log(verify); 
        req.token = token;
        next();
    }
    catch(error){
        return res.status(401).json({
            msg: 'invalid token '
        })
    }
}
