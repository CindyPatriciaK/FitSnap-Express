import express from "express";
import api from "./route/api.js";
import database from "./config/database.js"
import cors from "cors"
import dotenv from "dotenv";


dotenv.config();

const app = express()
app.use("/upload", express.static("upload"));
app.use(cors())
app.use(express.json())

app.use('/api',api)

app.get("/", (req, res)=>{
    res.status(200).json({
        message : "OK"
    })
})

app.listen(3000, () =>{
    database()
    console.log(`App berjalan di http://localhost:3000`);
})