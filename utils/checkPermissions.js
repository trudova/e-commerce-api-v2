const CustomeError = require("../errors");

const checkPermissions = (requestUser, resursUserId)=>{
    // console.log(requestUser)
    // console.log(resursUserId);
    // console.log(typeof resursUserId); user id is an obj
    if(requestUser.role ==="admin") return;
    if(requestUser.userId === resursUserId.toString()) return;
    throw new CustomeError.UnauthorizeddError("Not authorized to access this route")
}
module.exports =checkPermissions;