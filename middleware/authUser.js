import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.user)
    return res.status(400).json({ msg: "mohon login ke akun anda" });
  const user = await User.findOne({
    where: {
      uuid: req.session.user,
    },
  });
  if (!user) return res.status(404).json({ msg: "user tidak ditemukan" });
  req.userId = user.id;
  req.role = user.role;
  next();
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      uuid: req.session.user,
    },
  });
  if (user.role != "admin") {
    return res
      .status(400)
      .json({ msg: "hanya admin yang dapat mengakses halaman ini" });
  }
  next();
};
