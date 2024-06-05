const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payLoad = {
                // name: "yours truly",
                // iss: "pickurPahe.com"
                // aud:userId
                // bcz we use in option
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const option = {
                expiresIn: "15s",
                issuer: "pickurPahe.com",
                audience: userId
            };
            JWT.sign(payLoad, secret, option, (err, token) => {
                if (err){
                    console.log(err.message);
                    return reject(createError.InternalServerError())
                    // return reject(err);
                } 
                resolve(token);
            })
        })
    },
    verifyAccessToken: (req,res,next) =>{
        if(!req.headers['authorization'])return next(createError.Unauthorized())
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];
        JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payLoad)=>{
            if(err){
                // if(err.name === "JsonWebTokenError"){
                //     return next(createError.Unauthorized());
                // }else{
                //     return next(createError.Unauthorized(err.message))
                // }
                const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
                return next(createError.Unauthorized(message))
            }
            req.payLoad = payLoad;
            next();
        })
    },
    singRefreshToken :(userId) => {
        return new Promise((resolve, reject) => {
            const payLoad = {
                // name: "yours truly",
                // iss: "pickurPahe.com"
                // aud:userId
                // bcz we use in option
            }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const option = {
                expiresIn: "1y",
                issuer: "pickurPahe.com",
                audience: userId
            };
            JWT.sign(payLoad, secret, option, (err, token) => {
                if (err){
                    console.log(err.message);
                    return reject(createError.InternalServerError())
                    // return reject(err);
                } 
                resolve(token);
            })
        })
    }
}