import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register a new employee
export const registerEmployee = async (req, res) => {
  const { name, employeeId, email, phone, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = new Employee({
      name,
      employeeId,
      email,
      phone,
      address,
      password: hashedPassword,
      plainPassword: password // store original password for Owner
    });

    await employee.save();
    res.json({ message: "Employee registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering employee", error });
  }
};

// Login an employee
export const loginEmployee = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const employee = await Employee.findOne({ phone });

    if (employee && (await bcrypt.compare(password, employee.password))) {
      const token = jwt.sign(
        {
          _id: employee._id,
          name: employee.name,
          role: "employee"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        employee: {
          _id: employee._id,
          name: employee.name,
          phone: employee.phone,
          email: employee.email
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};


// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({}, "-password"); // exclude hashed password, keep plainPassword
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};

// Get single employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id, "-password"); // exclude hashed password
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  const { name, employeeId, email, phone, address, password } = req.body;

  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employee.name = name || employee.name;
    employee.employeeId = employeeId || employee.employeeId;
    employee.email = email || employee.email;
    employee.phone = phone || employee.phone;
    employee.address = address || employee.address;

    if (password) {
      employee.password = await bcrypt.hash(password, 10);
      employee.plainPassword = password; // update plain password as well
    }

    await employee.save();
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};
