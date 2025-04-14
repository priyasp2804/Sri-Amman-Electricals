import Owner from "../models/Owner.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkOwnerExists = async (req, res) => {
  try {
    const owner = await Owner.findOne({});
    res.json({ exists: !!owner });
  } catch (error) {
    res.status(500).json({ message: "Error checking owner existence", error });
  }
};

export const registerOwner = async (req, res) => {
  const { name, phone, gender, email, address, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = new Owner({ name, phone, gender, email, address, password: hashedPassword });

    await owner.save();
    res.json({ message: "Owner registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering owner", error });
  }
};

export const loginOwner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const owner = await Owner.findOne({ email });

    if (owner && (await bcrypt.compare(password, owner.password))) {
      const token = jwt.sign(
        {
          _id: owner._id,
          name: owner.name,
          role: "owner"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        token,
        owner: {
          _id: owner._id,
          name: owner.name,
          email: owner.email
        }
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

