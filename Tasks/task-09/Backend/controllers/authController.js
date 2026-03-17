import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    let admin = await Admin.findOne({ username });

    if (!admin && username === 'admin' && password === 'admin123') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      admin = new Admin({ username, password: hashedPassword });
      await admin.save();
    }

    if (!admin) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, username: admin.username });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};