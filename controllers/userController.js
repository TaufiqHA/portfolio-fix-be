import User from "../models/UserModel.js";
import argon2 from "argon2";
import Portfolio from "../models/portfolioModel.js";

export const get = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const create = async (req, res) => {
  const { name, email, password, confirm, role } = req.body;
  let hashPass;
  if (password == confirm) {
    hashPass = await argon2.hash(password);
  } else {
    res.status(400).json({ msg: "password tidak sesuai" });
  }
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPass,
      role: role,
    });
    res.status(201).json({ msg: "user telah ditambahkan" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        uuid: req.params.id,
      },
      attributes: ["name", "email", "role"],
      include: Portfolio,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const update = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  const { name, email, password, confirm, role } = req.body;
  let passFix;
  if (password == "" || password == null) {
    passFix = user.password;
  } else if (password == confirm) {
    passFix = await argon2.hash(password);
  } else {
    res.status(400).json({ msg: "password tidak sesuai" });
  }
  try {
    await User.update(
      {
        name: name,
        email: email,
        password: passFix,
        role: role,
      },
      {
        where: {
          uuid: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: "update data berhasil!!!" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const destroy = async (req, res) => {
  try {
    await User.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "user berhasil dihapus!!!" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
