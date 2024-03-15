import express from "express";
import connectDb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import cartRoutes from "./routes/cartRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import { Server } from "socket.io";

const app = express(); 
app.use(express.json());

connectDb();
app.use(passport.initialize());
app.use(cors());

app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/categories", categoryRoutes);
app.use('/reviews', reviewRoutes);
app.use("/cart", cartRoutes); 

const httpServer = app.listen(4000, () => {
  console.log("Server is running at http://localhost:4000");
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`); // Add logging
  });

  socket.on("sendMessage", (chatId, messageData) => {
    io.to(chatId).emit("newMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
