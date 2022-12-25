import passport = require("passport");
import GoogleStrategy = require("passport-google-oauth20");
import FacebookStrategy = require("passport-facebook");
import LocalStrategy = require("passport-local");
import "dotenv/config";
import db from "./data-source";
import { Users } from "./entities/Users";
import { Accounts } from "./entities/Accounts";
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
    async function (accessToken, refreshToken, profile, done) {
      const user = await db
        .getRepository(Users)
        .findOne({ where: { name: profile.displayName } })
        .then(async (result) => {
          if (result) {
            return done(null, result);
          }
          const users = new Users();
          users.name = profile.displayName;
          users.role = "user";
          users.createdAt = new Date();
          users.updatedAt = new Date();
          users.email = profile._json.email!;
          users.image = profile._json.picture!;
          users.bidder = "";

          const data = await db.getRepository(Users).save(users);
          const user_id = data.id.toString();

          const accounts = new Accounts();
          accounts.type = "oauth";
          accounts.provider = profile.provider;
          accounts.provider_account_id = profile.id;
          accounts.refresh_token = refreshToken;
          accounts.access_token = accessToken;
          accounts.expires_at = profile._json.exp;
          accounts.token_type = "Bearer";
          accounts.scope = "profile,email";
          accounts.id_token = "";
          accounts.user_id = user_id;
          accounts.createdAt = new Date();
          accounts.updatedAt = new Date();

          await db.getRepository(Accounts).save(accounts);

          return done(null, data);
        });
    }
  )
);

passport.use(
  new FacebookStrategy.Strategy(
    {
      clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
      clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
      profileFields: ["id", "displayName", "photos", "email"],
      callbackURL: "https://27a7-2403-6200-8958-5146-cdc5-f967-e077-fd13.ap.ngrok.io/authorization/facebook/callback/",
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile);

      const user = await db
        .getRepository(Users)
        .findOne({ where: { name: profile.displayName } })
        .then(async (result) => {
          if (result) {
            return done(null, result);
          }
          const users = new Users();
          users.name = profile.displayName;
          users.role = "user";
          users.createdAt = new Date();
          users.updatedAt = new Date();
          users.email = profile._json.email!;
          users.image = profile.photos![0].value!;
          users.bidder = "";

          const data = await db.getRepository(Users).save(users);
          const user_id = data.id.toString();

          const accounts = new Accounts();
          accounts.type = "oauth";
          accounts.provider = profile.provider;
          accounts.provider_account_id = profile.id;
          accounts.refresh_token = refreshToken;
          accounts.access_token = accessToken;
          accounts.expires_at = profile._json.exp;
          accounts.token_type = "Bearer";
          accounts.scope = "profile,email";
          accounts.id_token = "";
          accounts.user_id = user_id;
          accounts.createdAt = new Date();
          accounts.updatedAt = new Date();

          await db.getRepository(Accounts).save(accounts);

          return done(null, data);
        });
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("serializeUser");

  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  console.log("deserializeUser", user);

  done(null, user);
});
