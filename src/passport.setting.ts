import passport = require("passport");
import GoogleStrategy = require("passport-google-oauth20");
import FacebookStrategy = require("passport-facebook");
import "dotenv/config";

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: "/authorization/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);

      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
      callbackURL: "/authorization/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user!);
});
