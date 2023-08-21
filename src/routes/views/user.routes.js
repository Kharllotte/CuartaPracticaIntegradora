import { Router } from "express";
import authMiddleware from "../../helpers/auth.js";

const usersRouterView = Router();

usersRouterView.get("/profile", authMiddleware.isLoggedIn, (req, res) => {
  const allDocuments = { id: false, address: false, accountStatus: false };

  const documents = req.user.documents;
  documents.forEach((doc, i) => {
    allDocuments[doc.category] = true;
  });

  return res.render("user-profile", {
    user: req.user,
    documents: allDocuments,
  });
});

export default usersRouterView;
