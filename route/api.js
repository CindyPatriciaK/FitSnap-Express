import express from "express";
import * as userController from "../controllers/userController.js";
import * as postController from "../controllers/postController.js"
import * as progressController from "../controllers/progressController.js";
import * as commentController from "../controllers/commentController.js";
import { authenticateTokenMiddleware } from "../middlewares/authenticateTokenMiddleware.js";


const api = express.Router()

api.post("/signin", userController.signIn);
api.post("/signup", userController.signUp);

api.post("/post", authenticateTokenMiddleware, postController.createPost);
api.get("/post", authenticateTokenMiddleware, postController.listPost);
api.get("/post/:id", authenticateTokenMiddleware, postController.detailPost);
api.put("/post/:id", authenticateTokenMiddleware, postController.updatePost);
api.delete("/post/:id", authenticateTokenMiddleware, postController.deletePost);

api.post("/progress", authenticateTokenMiddleware, progressController.createProgress);
api.get("/progress", authenticateTokenMiddleware, progressController.listProgress);
api.get("/progress/:id", authenticateTokenMiddleware, progressController.detailProgress);
api.put("/progress/:id", authenticateTokenMiddleware, progressController.updateProgress);
api.delete("/progress/:id", authenticateTokenMiddleware, progressController.deleteProgress);

api.post("/comment", authenticateTokenMiddleware, commentController.createComment);
api.get("/comment", authenticateTokenMiddleware, commentController.listComment);
api.get("/comment/:id", authenticateTokenMiddleware, commentController.detailComment);
api.put("/comment/:id", authenticateTokenMiddleware, commentController.updateComment);
api.delete("/comment/:id", authenticateTokenMiddleware, commentController.deleteComment);



export default api