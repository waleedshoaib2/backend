import Product from "../models/productModel.js";
import dotenv from "dotenv";
dotenv.config();
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

export const getProducts = async (req, res) => {
  let keyword = [{}];

  if (req.query.search && req.query.search !== "null") {
    keyword = [
      { name: { $regex: req.query.search, $options: "i" } },
      { category: { $regex: req.query.search, $options: "i" } },
      { brand: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  try {
    const products = await Product.find({ $or: keyword });
    res.json({ products }); // Return all matching products
  } catch {
    res.status(404).json({ message: "Products not found" });
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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      const public_id = product.image.split("/").pop().split(".")[0]; // Extract public_id
      await cloudinary.v2.uploader.destroy(public_id);
    }
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
};
