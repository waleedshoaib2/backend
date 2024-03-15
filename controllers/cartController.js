import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    
    const cart = await Cart.findOne({ userId: req.user }).populate(
      "items.productId"
    ); 
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error getting cart" });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    console.log("Incoming Request:", req); 


    const { productId, quantity } = req.body;
    const userId = req.user;

    console.log("productId:", productId);
    console.log("quantity:", quantity);
    console.log("userId:", userId);
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.productId.equals(productId));

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    
    res.status(500).json({ error: "Error adding item to cart" });
  }
};

export const updateItemInCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items.id(itemId).remove();
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
};
