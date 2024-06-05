const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv").config();
const authRoute = require("./Routes/Auth.Route");
const connectToDatabase = require("./helper/init_mongodb")
const { verifyAccessToken } = require("./helper/jwt.Helper")

const app = express();
app.use(express.json());
app.use(morgan('dev'));
connectToDatabase();

app.get('/', verifyAccessToken , async (req, res, next) => {
    console.log(req.headers['authorization'])
    res.send("hellow from app")
    console.log(req.payload)
})

app.use("/auth", authRoute);

app.use(async (req, res, next) => {
    // const error =new Error("NOT FOUND");
    // error.status = 404;
    // next(error);
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`app runing in ${port}`);
})