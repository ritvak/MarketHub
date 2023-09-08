const userModel = require('../Models/userModel');
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const jwt = require('jsonwebtoken');

const generateToken = _id => {
  const jwtKey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtKey, { expiresIn: '30d' });
};

passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/users/facebook/callback",
      },
        async (accessToken, refreshToken, profile, done) => {
            try {
              console.log("in facebook", profile)
              let user = await userModel.findOne({ facebookId: profile.id });
      
              if (user) {
                console.log("done with facebook", user);
                done(null, user); // Login if User already exists
              } else {
                user = new userModel({
                  facebookId: profile.id,
                  name: profile.displayName,
                });
      
                await user.save(); // Save User if there are no errors
                console.log("saving user ...");
                const token = generateToken(user._id);
                user = await userModel.findOneAndUpdate({ _id: user._id }, { token: token }, { new: true });
                console.log("saving token ...");
                done(null, user);
              }
            } catch (err) {
              console.log(err);
              done(err); // handle errors!
          }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  