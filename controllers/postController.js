import PostModel from "../models/PostModel.js";

export const createPost = async (req, res) => {
    try {
        const request = req.body;
        const { caption, imageUrl } = request;

        if (!caption || !imageUrl) {
            return res.status(400).json({
                message: "Caption dan Image wajib diisi",
                data: null
            });
        }

        const response = await PostModel.create({
            caption,
            imageUrl,
            createdBy: req.user?.user_id
        });

        return res.status(200).json({
            message: "Postingan berhasil ditambahkan",
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};

export const listPost = async (req, res) => {
    try {
        const response = await PostModel.find({
            createdBy: req.user?.user_id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "List semua postingan",
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error",
            error: error.message,
            data: null
        });
    }
};

export const detailPost = async (req, res) => {
    try {
        const id = req.params?.id;

        if (!id) {
            return res.status(400).json({
                message: "Id postingan wajib diisi",
                data: null
            });
        }

        const response = await PostModel.findOne({
            _id: id,
            createdBy: req.user?.user_id
        });

        if (!response) {
            return res.status(404).json({
                message: "Postingan tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            message: "Detail postingan",
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const id = req.params?.id;
        const request = req.body;

        const { caption, imageUrl } = request;

        if (!id) {
            return res.status(400).json({
                message: "Id postingan wajib diisi",
                data: null
            });
        }

        const response = await PostModel.findOneAndUpdate(
            {
                _id: id,
                createdBy: req.user?.user_id
            },
            { caption, imageUrl },
            { new: true }
        );

        if (!response) {
            return res.status(500).json({
                message: "Postingan gagal diupdate",
                data: null
            });
        }

        return res.status(200).json({
            message: "Postingan berhasil diupdate",
            data: response
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const id = req.params?.id;

        if (!id) {
            return res.status(400).json({
                message: "Id postingan wajib diisi",
                data: null
            });
        }

        const response = await PostModel.findOneAndDelete({
            _id: id,
            createdBy: req.user?.user_id
        });

        if (!response) {
            return res.status(404).json({
                message: "Postingan tidak ditemukan",
                data: null
            });
        }

        return res.status(200).json({
            message: "Postingan berhasil dihapus",
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: null
        });
    }
};
