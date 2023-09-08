const adminloginModel = require('../Models/adminloginModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();
const myemail = process.env.SENDER_EMAIL;
const mypassword = process.env.APPLICATION_PASSWORD;

const generateToken = _id => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtKey, { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await adminloginModel.findOne({ email });

    if (!admin)
      return res.status(400).json({
        status: '400',
        message: 'Invalid email or password.',
      });

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword)
      return res.status(400).json({
        status: '400',
        message: 'Invalid email or password.',
      });

    const token = generateToken(admin._id);

    admin = await adminloginModel.findOneAndUpdate(
      { _id: admin._id },
      { token: token },
      { new: true }
    );

    res.status(200).json({
      message: 'Login successfully',
      userData: {
        _id: admin._id,
        token,
      },
    });
  } catch (e) {
    res.status(500).json({
      message: e,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = '64b34c7fc3aa9d2adc067e35';

    const admin = await adminloginModel.findById(userId);

    const isPasswordMatch = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Incorrect old password.' });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password
    await adminloginModel.findByIdAndUpdate(userId, { password: hashedPassword });

    // Create a new JWT token with the updated user data
    const updatedUser = { ...admin._doc, password: hashedPassword };
    const jwtKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(updatedUser, jwtKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Password changed successfully.', token });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'An error occurred while changing the password.' });
  }
};


const sendPasswordResetEmail = (email, admin) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: myemail, 
      pass: mypassword, 
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const link = `https://admin-control-panel.netlify.app/resetPassword/${admin._id}/${admin.token}`;

  const mailOptions = {
    from: myemail,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`,
  };

  transporter.sendMail(mailOptions, error => {
    if (error) {
      console.error('Error sending reset email:', error);
    } else {
      console.log('Reset email sent successfully.');
    }
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await adminloginModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found.' });
    }

    sendPasswordResetEmail(email, admin);

    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ message: 'An error occurred while sending the password reset email.' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const jwtKey = process.env.JWT_SECRET_KEY;
    const decodedToken = jwt.verify(token, jwtKey);
    console.log("decode token  "+decodedToken);
    const userId = '64b34c7fc3aa9d2adc067e35';

    const admin = await adminloginModel.findById(userId);

    if (!admin) {
      return res.status(404).json({ message: 'Admin user not found.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await adminloginModel.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    
    if (error instanceof jwt.JsonWebTokenError) {
      console.log("ERror message : " + error);
      return res.status(400).json({ message: 'Invalid or expired token.' , errorMessage: error});
    }
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'An error occurred while changing the password.' });
  }
};
module.exports = { loginAdmin, updatePassword, forgotPassword,resetPassword};
