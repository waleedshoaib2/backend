import Product from "../models/productModel.js";

import multer from "multer";

import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createProduct = async (req, res) => {
  try {
    let imageURL = "";
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path);
      imageURL = uploadResult.secure_url;
    }

    const newProduct = new Product({
      ...req.body,
      image: imageURL,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    for (const field in req.body) {
      product[field] = req.body[field];
    }

    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path);
      product.image = uploadResult.secure_url;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
};
