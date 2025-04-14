import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: String,
  employeeId: String,
  email: String,
  phone: String,
  address: String,
  password: String,
  plainPassword: String  
});

export default mongoose.model("Employee", EmployeeSchema);
