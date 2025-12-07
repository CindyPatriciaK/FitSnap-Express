import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

export const verifyPassword = async (password, hashedPasswordValue) => {
    return await bcrypt.compare(password, hashedPasswordValue);
}
