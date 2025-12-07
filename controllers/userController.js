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
