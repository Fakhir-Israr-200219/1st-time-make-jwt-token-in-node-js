const express = require("express");
const router = express.Router();
const createError = require("http-errors")
const User = require("../Models/user.Model");
const { authSchema } = require("../helper/validation.Schema");
const { signAccessToken, singRefreshToken } = require("../helper/jwt.Helper");
const bcrypt = require("bcrypt")

router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // if(!email || !password){
        //     throw createError.BadRequest();
        // }
        const result = await authSchema.validateAsync(req.body);

        const doseExist = await User.findOne(result);
        if (doseExist) throw createError.Conflict(`${email} this email is already exist`);

        const user = new User({ email, password });
        const saveUser = await user.save();
        const accessToken = await signAccessToken(saveUser.id);
        const refreshToken = await singRefreshToken(saveUser.id);

        res.send({ accessToken,refreshToken });

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({ email: result.email });
        if (!user) throw createError.NotFound("User not register");


        // const isMatch = await user.isValidPassword(result.password) 
        const isMatch = await bcrypt.compare(result.password, user.password);
        if (!isMatch) throw createError.Unauthorized("user and password not valid")

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await singRefreshToken(saveUser.id);

        res.send({ accessToken,refreshToken })
    }
    catch (err) {
        if (err.isJoi === true) return next(createError.BadRequest("invalid userName/Password"));
        next(err)
    }

});

router.post("/refresh-token", async (req, res, next) => {
    res.send("refresh-token");
})

router.delete("/logout", async (req, res, next) => {
    res.send("log out");
})






module.exports = router;

