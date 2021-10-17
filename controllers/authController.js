const User = require("../models/User");
const {StatusCodes}= require("http-status-codes");
const { attachCookiesTorespons, createTokenUser } = require("../utils");
   
const CustomError = require("../errors");

const register = async(req,res)=>{
    const {email, name, password} = req.body;
    const emailAlreaduExists= await User.findOne({email});
    if(emailAlreaduExists){
        throw new CustomError.BadRequestError("Email alredy exists. Provide unique email");
    }
    // first registerd user is an admin
    const isFirstAccount = (await User.countDocuments({}))===0;
    const role = isFirstAccount ? "admin": "user";
  const user = await User.create({name, email, password, role});

  const tokenUser = createTokenUser(user);
  
    attachCookiesTorespons({res,user:tokenUser})
  res.status(StatusCodes.CREATED).json({ user:tokenUser });

}

const login = async (req, res) => {
const {email, password } = req.body;
if(!email || !password){
    throw new CustomError.BadRequestError("please provide email and password");
}
const user = await User.findOne({email});
if(!user){
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
}
const isPasswordCorrect = await user.comparePassword(password);
if(!isPasswordCorrect){
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
}

  const tokenUser = createTokenUser(user);

  attachCookiesTorespons({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });

};

const logout = async (req, res) => {
 res.cookie("token", "logout", {
     httpOnly: true,
     expires: new Date( Date.now())
 });
return res.status(StatusCodes.OK).json()
};

module.exports={
    register,
    login,
    logout
};