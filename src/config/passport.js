import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils/index.js";
import userModel from "../dao/models/mongodb/user.js";
import { Strategy as GitHubStrategy } from "passport-github2";
import cartsManager from "../dao/managers/mongodb/carts.js";
import env from "../config/env.js";
import logger from "../utils/logger/index.js";

const LocalStrategy = local.Strategy;
const carts = new cartsManager();

const initializePassport = () => {
  passport.use(
    "signup",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { firstName, lastName, age } = req.body;
        try {
          const user = await userModel.findOne({ email });
          if (user) {
            logger.warning("User already exists");
            return done(null, false);
          }

          const cart = await createCart();

          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password),
            cart,
          };
          const result = await userModel.create(newUser);
          return done(null, result);
        } catch (err) {
          return done("Internal server error " + err);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userModel
            .findOne({ email })
            .populate("cart.carts");
          if (!user) {
            logger.warning("User no found");
            done(null, false);
          }
          if (!isValidPassword(user, password)) {
            logger.warning("Incorrect password");
            return done(null, false);
          }
          user.lastConnection = Date.now();
          await user.save();
          done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET,
        scope: ["user:email"],
        callbackURL: "/auth/github/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        let user = await userModel.findOne({ email }).populate("cart.carts");

        if (!user) {
          const cart = await createCart();
          const newUser = {
            firstName: profile.displayName,
            lastName: "",
            email,
            age: -1,
            password: null,
            cart,
          };
          user = await userModel.create(newUser);
        }

        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    const user = await userModel.findById(_id).populate("cart.carts");
    done(null, user);
  });
};

const createCart = async () => {
  const query = {
    products: [],
  };
  return await carts.save(query);
};

export const authorization = (rol) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.session.user.rol === rol) {
      return next();
    } else {
      return res.send("Acceso denegado");
    }
  };
};

export default initializePassport;
