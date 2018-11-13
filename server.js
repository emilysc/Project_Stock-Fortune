const process = require("process");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require("./routes/apiRoutes");
const passport = require('passport');

// Define middleware here
const session = require("express-session");
app.use(express.static("public"));
app.use(session({ secret: "emily" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Serve up static assets (usually on heroku)
//if (process.env.NODE_ENV === "production") {
app.use(express.static("client/build"));
//}

// Connect to the Mongo DB
// If deployed, use the deployed database. Otherwise use the local nytreact database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytreact";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (error) {
  if (error) {
    console.error(error);
    throw error;
  }
});

const db = require("./models");

// Google intergation
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '76633848002-1s8a90f08dddb72i3u172ok1f603kd6k.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'rp9EIX8W31KiBrjQsHp5AYgW';

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  db.User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === "production" ?
    "https://emily-stock-fortune.herokuapp.com/auth/google/callback" :
    `http://localhost:${PORT}/auth/google/callback`
},
  function (accessToken, refreshToken, profile, cb) {
    db.User.findOneAndUpdate(
      { googleId: profile.id },
      {
        $set: {
          displayName: profile.displayName
        }
      },
      { new: true, upsert: true },
      function (err, user) {
        return cb(err, user);
      }
    );
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
app.get('/auth/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
// Use apiRoutes
app.use("/api", apiRoutes);

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
