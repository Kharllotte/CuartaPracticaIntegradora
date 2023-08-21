import { Router } from "express";
import passport from "passport";
import authMiddleware from "../../helpers/auth.js";

import Users from "../../dao/managers/mongodb/users.js";
const userManager = new Users();

import PasswordReset from "../../dao/managers/mongodb/passwordReset.js";
import { isValidPassword } from "../../utils/index.js";
import transporter from "../../config/mailer.js";
const prManager = new PasswordReset();

const authRouterView = Router();

const layout = "logout";

authRouterView.get(
  "/password-reset",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    return res.render("password-reset", {
      layout,
      isLogin: true,
    });
  }
);

const getPwrAndValid = async (url) => {
  const pwr = await prManager.findByUrl(url);
  if (!pwr.active) return null;

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  const validHour = now - Number(pwr.date);

  if (validHour >= oneHour) return null;

  return pwr;
};

authRouterView.get(
  "/recovery-password/:url",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    const url = req.params.url;
    const pwr = await getPwrAndValid(url);

    if (!pwr) {
      return res.redirect("/auth/login");
    }

    return res.render("recovery-password", {
      layout,
      isLogin: true,
      user: pwr.userId.email,
    });
  }
);

authRouterView.post(
  "/recovery-password/:url",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    try {
      const url = req.params.url;
      const pwr = await getPwrAndValid(url);

      if (!pwr) {
        return res.redirect("/auth/login");
      }

      const password = req.body.password;
      const uid = pwr.userId._id;

      if (isValidPassword(pwr.userId, password)) {
        return res.json({
          success: "false",
          payload: pwr,
          message: "Equals password",
        });
      }

      const user = await userManager.updatePassword(uid, password);

      await prManager.updateStatus(pwr._id, false);

      return res.json({
        success: "true",
        payload: user,
        message: "Update password",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: "false",
        payload: null,
        message: "Error Update password",
      });
    }
  }
);

authRouterView.post(
  "/password-reset",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    try {
      const email = req.body.email;

      const user = await userManager.findByEmail(email);

      if (!user) {
        return res.json({
          success: "false",
          payload: null,
          message: "User no found",
        });
      }

      const pwr = await prManager.save({
        userId: user._id,
      });

      const html = `
      <h3>Para restablecer su contrasena, por favor de clic al enlace:</h3>
      <a href='${process.env.URL}/auth/recovery-password/${pwr.url}'>Restablecer contrasena</>
      `;

      const mailOptions = {
        from: "lilikathe99@gmail.com",
        to: email,
        subject: "Recuperacion de contrasena",
        html,
      };

      await transporter.sendMail(mailOptions);

      return res.json({
        success: "true",
        payload: pwr,
      });
    } catch (error) {
      console.log(error);
      return res.json({
        success: "false",
        payload: null,
        message: "Internal server error",
      });
    }
  }
);

authRouterView.get("/login", authMiddleware.isNotLoggedIn, async (req, res) => {
  return res.render("login", {
    layout,
    isLogin: true,
  });
});

authRouterView.post(
  "/login",
  authMiddleware.isNotLoggedIn,
  passport.authenticate("login", {
    failureRedirect: "/auth/login",
    successRedirect: "/products",
  })
);

authRouterView.get(
  "/signup",
  authMiddleware.isNotLoggedIn,
  async (req, res) => {
    return res.render("signup", {
      layout,
      isLogin: false,
    });
  }
);

authRouterView.post(
  "/signup",
  authMiddleware.isNotLoggedIn,
  passport.authenticate("signup", {
    failureRedirect: "/auth/register",
    successRedirect: "/products",
  })
);

authRouterView.get("/logout", authMiddleware.isLoggedIn, async (req, res) => {
  req.session.destroy();
  req.user.lastConnection = Date.now();
  await req.user.save();
  res.redirect("/auth/login");
});

authRouterView.get("/github", passport.authenticate("github"));

authRouterView.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  (req, res) => {
    res.redirect("/products"); // Cambia esta URL según tus necesidades
  }
);

export default authRouterView;
