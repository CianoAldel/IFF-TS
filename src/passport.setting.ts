import passport = require("passport");
import GoogleStrategy = require("passport-google-oauth20");
import FacebookStrategy = require("passport-facebook");
import LocalStrategy = require("passport-local");
import "dotenv/config";
import db from "./data-source";
import { Users } from "./entities/Users";
import bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy.Strategy(async (username: string, password: string, done) => {
    const dataUser = await db.getRepository(Users).findOne({ where: { username: username } });
    if (dataUser == null) {
      return done(null, false, { message: "No user with that username" });
    }
    try {
      if (await bcrypt.compare(password, dataUser.password)) {
        return done(null, dataUser);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  })
);

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: "/authorization/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
      callbackURL: "https://7143-2403-6200-8958-5146-306b-c5db-e1a2-5778.ap.ngrok.io/authorization/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("serializeUser");
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  console.log("deserializeUser");

  done(null, user);
});
