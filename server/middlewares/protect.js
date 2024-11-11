const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model')

module.exports.protect = async (req, res, next ) => {
    if(req.cookies.token){
       
        try {
            let data = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
            let user = await userModel.findOne({email:data.email}).select("-password")
            req.user = user;

            next()
        } catch (error) {
            res.status(401).send("Not Authorized")
        }
    }

    if(!req.cookies.token){
        res.status(401).send("Not Authorized, You don't have permission to access")
    }
}