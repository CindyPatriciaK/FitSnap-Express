import PostModel from "../models/PostModel.js";
import CommentModel from "../models/CommentModel.js";

export const createPost = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    console.log("req.user:", req.user);

    const { caption } = req.body;
    // ✅ ambil dari req.file, bukan req.body
    const imageUrl = req.file ? `uploads/${req.file.filename}` : null;

    if (!caption || !imageUrl) {
      return res.status(400).json({
        message: "Caption dan Image wajib diisi",
        data: null,
      });
    }

    const response = await PostModel.create({
      caption,
      imageUrl,
      userId: req.user?.user_id,
    });

    return res.status(201).json({
      message: "Postingan berhasil ditambahkan",
      data: response,
    });
  } catch (error) {
    console.error("❌ ERROR createPost:", error);
    return res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};

export const listPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // 🔥 hitung komentar per post
    const postsWithCommentCount = await Promise.all(
      posts.map(async (post) => {
        const count = await CommentModel.countDocuments({
          postId: post._id,
        });

        return {
          ...post.toObject(),
          commentCount: count,
        };
      })
    );

    return res.status(200).json({
      message: "List semua postingan",
      data: postsWithCommentCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null,
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
            userId: req.user?.user_id
        }).populate("userId", "username");

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
        const { caption, imageUrl } = req.body;

        if (!id) {
            return res.status(400).json({
                message: "Id postingan wajib diisi",
                data: null
            });
        }

        const updateData = {};
        if (caption) updateData.caption = caption;
        if (imageUrl) updateData.imageUrl = imageUrl;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "Tidak ada data untuk diupdate",
                data: null
            });
        }

        const response = await PostModel.findOneAndUpdate(
            { _id: id, userId: req.user?.user_id }, 
            updateData,
            { new: true }
        );

        if (!response) {
            return res.status(404).json({
                message: "Postingan tidak ditemukan",
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
            userId: req.user?.user_id
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

export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.user_id; // ✅ FIX

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("❌ LIKE ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

