import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://waleedshoaib20:skyrim@cluster0.pwrhkza.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Mongo Db is connected");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;
