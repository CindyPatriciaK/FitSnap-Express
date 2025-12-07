import express from "express";
import * as userController from "../controllers/userController.js";


const api = express.Router()

api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);


export default api