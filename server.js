import express from "express";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import passport from "passport"; // Import passport
import "./config/passport.js"; // Assuming passport.js now uses ES modules
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
const server = express();

server.use(express.json());

connectDb();
server.use(passport.initialize()); // Initialize Passport
server.use(cors());
server.use("/product", productRoutes);
server.use("/user", userRoutes);
server.use("/chat", chatRoutes);

server.use("/categories", categoryRoutes);

server.listen(4000, () => {
  console.log("Server is running at http://localhost:4000");
});
