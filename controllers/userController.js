import UserModel from "../models/UserModel.js";
import { hashedPassword, verifyPassword } from "../utils/hashUtil.js";
import { getJwtToken } from "../utils/jwtUtil.js";


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                error: 'Email dan Password wajib diisi',
                data: null
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).send({
                error: 'Email atau Password salah',
                data: null
            });
        }

        const isMatch = await verifyPassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send({
                error: 'Password salah',
                data: null
            });
        }

        const token = getJwtToken(user._id, user.username);

        return res.status(200).send({
            message: 'Login berhasil',
            data: { token }
        });

    } catch (error) {
        return res.status(400).send({
            message: error.message,
            error,
            data: null
        });
    }
};

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({
                error: 'Username, Email dan Password wajib diisi',
                data: null
            });
        }

        const hashed = await hashedPassword(password);

        const newUser = await UserModel.create({ 
            username,
            email,
            password: hashed
        });

        return res.status(200).send({
            message: 'Berhasil melakukan pendaftaran, silahkan login',
            data: null
        });

    } catch (error) {
        return res.status(400).send({
            message: error.message,
            error,
            data: null
        });
    }
};

export const getProfile = async (req, res) => {
  try {
     const userId = req.user.user_id
    if (!userId) {
      return res.status(400).json({
        message: "User ID tidak ditemukan di token",
      });
    }

    const user = await UserModel.findById(userId).select("username bio");

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.status(200).json({
      username: user.username,
      bio: user.bio,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;

    const updateData = { username, bio };

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const user = await UserModel.findByIdAndUpdate(
      req.user.user_id,
      updateData,
      { new: true }
    ).select("username bio profilePicture");

    res.status(200).json({
      message: "Profile berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.user.user_id);

    res.status(200).send({
      message: "Akun berhasil dihapus",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

