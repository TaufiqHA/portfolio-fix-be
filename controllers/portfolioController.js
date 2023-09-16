import Portfolio from "../models/portfolioModel.js";
import path from "path";
import { Op } from "sequelize";

export const get = async (req, res) => {
  try {
    const response = await Portfolio.findAll();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const create = async (req, res) => {
  if (req.files === null)
    return res.status(404).json({ msg: "no file uploaded" });
  const name = req.body.title;
  const userId = req.userId;
  const file = req.files.file;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
  const allowedType = [".png", ".jpg", "jpeg"];

  if (!allowedType.includes(ext.toLocaleLowerCase()))
    return res.status(422).json({ msg: "invalid images" });
  if (filesize > 50000000)
    return res.status(422).json({ msg: "images must be less than 5 MB" });

  file.mv(`./public/images/${filename}`, async (error) => {
    if (error) return res.status(500).json(error.message);
    try {
      await Portfolio.create({
        name: name,
        image: filename,
        url: url,
        userId: userId,
      });
      res.status(200).json({ msg: "portfolio berhasil ditambahkan" });
    } catch (error) {
      console.info(error.message);
    }
  });
};

export const getById = async (req, res) => {
  try {
    const response = await Portfolio.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

export const update = async (req, res) => {
  const portfolio = await Portfolio.findOne({
    where: {
      [Op.and]: [{ uuid: req.params.id }, { userId: req.userId }],
    },
  });
  if (!portfolio)
    return res.status(404).json({ msg: "portfolio tidak ditemukan" });

  if (req.files === null) {
    const name = req.body.title;
    const userId = req.userId;
    try {
      await Portfolio.update(
        {
          name: name,
          image: portfolio.image,
          url: portfolio.url,
          userId: userId,
        },
        {
          where: {
            uuid: req.params.id,
          },
        }
      );
      res.status(200).json({ msg: "portfolio berhasil diupdate" });
    } catch (error) {
      res.status(400).json(error.message);
    }
  } else {
    const name = req.body.title;
    const userId = req.userId;
    const file = req.files.file;
    const filesize = file.data.length;
    const ext = path.extname(file.name);
    const filename = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext.toLocaleLowerCase())) {
      return res
        .status(400)
        .json({ msg: "file yang anda unggah bukan gambar" });
    }
    if (filesize > 5_000_000) {
      return res
        .status(400)
        .json({ msg: "file yang dapat diunggah maksimal 5 MB" });
    }

    file.mv(`./public/images/${filename}`, async (err) => {
      if (err) return res.status(400).json(err.message);
      try {
        await Portfolio.update(
          {
            name: name,
            image: filename,
            url: url,
            userId: userId,
          },
          {
            where: {
              uuid: req.params.id,
            },
          }
        );
        res.status(200).json({ msg: "portfolio berhasil diupdate" });
      } catch (error) {
        res.status(400).json(error.message);
      }
    });
  }
};

export const destroy = async (req, res) => {
  try {
    await Portfolio.destroy({
      where: {
        [Op.and]: [{ uuid: req.params.id }, { userId: req.userId }],
      },
    });
    res.status(200).json({ msg: "portfolio berhasil dihapus!!!" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
