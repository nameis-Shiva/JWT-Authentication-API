const userModel  = require('../models/user-model') 
const bcrypt  = require('bcrypt');
const generateToken = require('../utils/generateToken');

module.exports.registerUser = async function (req,res) { 
    const { name, email, password } = req.body;

    try {
        let user = await userModel.findOne({email});

         if(user){
              return res.status(400).send("Your Account already exits, Please login...!")
         }

         let salt = await bcrypt.genSalt(10);  // 10 rounds are a standard value
         let hash = await bcrypt.hash(password, salt);  // Pass both the password and the salt
         

    user = await userModel.create({
        email,
        password:hash,
        name
    })

    let token = generateToken({email});

    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).send(user)

    } catch (error) {
        res.status(500).send(error.message)    
    }

}

module.exports.loginUser = async function (req,res) { 
    const {email, password} = req.body;
    try {
        let user = await userModel.findOne({email});
    if(!user){
        return res.status(500).send("Email or Password Incorrect")
    }
    let result = bcrypt.compare(password,user.password);
    if(result){

        let token = generateToken({email});

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    
        res.status(200).send("Logged in Successfully")
    
    } else {
        return res.status(500).send("Email or Password Incorrect")
    }
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports.logoutUser = function (req,res) {
    res.cookie("token","",{
        httpOnly:true,
        secure:true,
    });

    res.status(200).send("Logged Out Successfully")
 }

module.exports.getUserProfile = function (req,res) { 
    res.send(req.user)

}