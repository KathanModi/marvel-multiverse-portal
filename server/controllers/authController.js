const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // Make sure to npm install nodemailer

// 1. Update Profile (Email & Profile Pic)
exports.updateProfile = async (req, res) => {
  try {
    const { email, profilePic } = req.body;
    const user = await User.findById(req.userId); 

    if (!user) return res.status(404).json({ msg: "Agent not found." });

    if (email) user.email = email;
    if (profilePic) user.profilePic = profilePic;

    const updatedUser = await user.save();
    
    res.json({ 
      user: { 
        id: updatedUser._id, 
        username: updatedUser.username, 
        email: updatedUser.email, 
        profilePic: updatedUser.profilePic 
      } 
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile." });
  }
};

// 2. Forgot Password (REAL Nodemailer Logic)
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "No Agent found with that email." });

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Configure the Transporter (Using Gmail as an example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email from .env
        pass: process.env.EMAIL_PASS, // Your App Password from .env
      },
    });

const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: '"SHIELD Academy" <no-reply@marvelhub.com>',
      to: user.email,
      subject: 'SECURITY CLEARANCE: Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #ed1d24; padding: 20px;">
          <h2 style="color: #ed1d24;">MARVEL HUB</h2>
          <p>Agent <strong>${user.username.toUpperCase()}</strong>,</p>
          <p>You requested a password reset. Click the button below to update your security key:</p>
          <a href="${resetUrl}" style="background: #ed1d24; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">RESET PASSWORD</a>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Recovery transmission sent to your email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Email transmission failed." });
  }
};

// 3. Forgot Username (Sends Alias to Email)
exports.forgotUsername = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ msg: "Email not found." });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"SHIELD Academy" <no-reply@marvelhub.com>',
      to: user.email,
      subject: 'IDENTITY RECOVERY: Agent Alias',
      text: `Greetings Agent. Your registered Alias for Marvel Hub is: ${user.username}`
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: "Your Agent Alias has been sent to your email." });

  } catch (err) {
    res.status(500).json({ msg: "Failed to send username." });
  }
};

// 4. Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Token invalid or expired." });

    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Security clearance updated. Please login." });
  } catch (err) {
    res.status(500).json({ msg: "Reset failed." });
  }
};

// 5. Register & 6. Login (Keeping your existing logic but ensuring userId sync)
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingAgent = await User.findOne({ email });
    if (existingAgent) return res.status(400).json({ msg: "Agent already enlisted." });

    const user = new User({ username, email, password });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'marvel_secret_key', { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, username, email, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ msg: "Invalid Credentials." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'marvel_secret_key', { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic } });
  } catch (err) {
    res.status(500).json({ msg: "Server error." });
  }
};