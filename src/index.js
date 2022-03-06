require('dotenv').config({path: './config.env'});
//สร้างตัวแปรเพื่อเก็บค่า modules express มาใช้
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 4001

const userRoute = require("./routes/userRoute");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/user",userRoute);

require("./db")(app);

app.get("/", (req,res)=>{
    res.send("Hello from index");
});

app.listen(port, ()=>{
    console.log("App is runnig on port " + port);
});