const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.Login);


router.get("/logout", userController.Logout);

module.exports = router;