import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  gender: String,
  email: String,
  address: String,
  password: String,
});

export default mongoose.model("Owner", OwnerSchema);
