import User from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match)
    return res.status(400).json({ msg: "password yang anda masukkan salah" });
  req.session.user = user.uuid;
  const uuid = user.uuid;
  const email = user.email;
  const name = user.name;
  res.status(200).json({ uuid, name, email });
};

export const me = async (req, res) => {
  if (!req.session.user) {
    return res.status(400).json({ msg: "mohon login ke akun anda!!!" });
  }
  const user = await User.findOne({
    where: {
      uuid: req.session.user,
    },
    attributes: ["name", "email", "role"],
  });
  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
  res.status(200).json(user);
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "tidak dapat logout" });
    res.status(200).json({ msg: "sayonaraaaa" });
  });
};
