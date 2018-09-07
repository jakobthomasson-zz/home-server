import * as express from "express";

// Controllers (route handlers)
import * as home_controller from "../controllers/home";
import * as user_controller from "../controllers/user";
import * as contact_controller from "../controllers/contact";
import * as passport_config from "../config/passport";


const router = express.Router();

router.get("/", home_controller.index);
router.get("/login", user_controller.getLogin);
router.post("/login", user_controller.postLogin);
router.get("/logout", user_controller.logout);
router.get("/forgot", user_controller.getForgot);
router.post("/forgot", user_controller.postForgot);
router.get("/reset/:token", user_controller.getReset);
router.post("/reset/:token", user_controller.postReset);
router.get("/signup", user_controller.getSignup);
router.post("/signup", user_controller.postSignup);
router.get("/contact", contact_controller.getContact);
router.post("/contact", contact_controller.postContact);
router.get("/account", passport_config.isAuthenticated, user_controller.getAccount);
router.post("/account/profile", passport_config.isAuthenticated, user_controller.postUpdateProfile);
router.post("/account/password", passport_config.isAuthenticated, user_controller.postUpdatePassword);
router.post("/account/delete", passport_config.isAuthenticated, user_controller.postDeleteAccount);
router.get("/account/unlink/:provider", passport_config.isAuthenticated, user_controller.getOauthUnlink);


export default router;
