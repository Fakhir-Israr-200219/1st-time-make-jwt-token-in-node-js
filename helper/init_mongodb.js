const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost:27017' , {dbName :"fisrt_1st"})
// .then(()=>{
//     console.log("db is connected")
// })
// .catch((err) => console.log(err.message))

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MOGODB_URI, { dbName: process.env.DB_NAME });
        console.log("db is connected");

        const host = mongoose.connection.host;
        const connected = mongoose.connection.readyState === 1; 

        console.log(`Host: ${host}`);
        console.log(`Connected: ${connected}`);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectToDatabase;