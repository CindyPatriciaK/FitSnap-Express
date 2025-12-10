import CommentModel from "../models/CommentModel.js";
import PostModel from "../models/PostModel.js";


export const createComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;

        if (!postId || !comment) {
            return res.status(400).json({
                message: "postId dan comment wajib diisi",
                data: null
            });
        }

        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Postingan tidak ditemukan",
                data: null
            });
        }

        const newComment = await CommentModel.create({
            postId,
            userId: req.user?.user_id,
            comment
        });

        return res.status(200).json({
            message: "Komentar berhasil ditambahkan",
            data: newComment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};


export const listComment = async (req, res) => {
    try {
        const { postId } = req.query; 

        if (!postId) {
            return res.status(400).json({
                message: "postId wajib dikirimkan",
                data: null
            });
        }

        const comments = await CommentModel.find({ postId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "List semua komentar",
            data: comments
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};


export const detailComment = async (req, res) => {
    try {
        const id = req.params?.id;

        if (!id) {
            return res.status(400).json({
                message: "Id comment wajib diisi",
                data: null
            });
        }

        const comment = await CommentModel.findById(id);

        if (!comment) {
            return res.status(404).json({
                message: "Komentar tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            message: "Detail komentar",
            data: comment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};


export const updateComment = async (req, res) => {
    try {
        const id = req.params?.id;
        const { comment } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Id comment wajib diisi",
                data: null
            });
        }

        const updated = await CommentModel.findOneAndUpdate(
            {
                _id: id,
                userId: req.user?.user_id
            },
            { comment },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Komentar gagal diupdate atau tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            message: "Komentar berhasil diupdate",
            data: updated
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const id = req.params?.id;

        if (!id) {
            return res.status(400).json({
                message: "Id comment wajib diisi",
                data: null
            });
        }

        const deleted = await CommentModel.findOneAndDelete({
            _id: id,
            userId: req.user?.user_id
        });

        if (!deleted) {
            return res.status(404).json({
                message: "Komentar tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            message: "Komentar berhasil dihapus",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};
