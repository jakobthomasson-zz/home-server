import * as express from "express";

// Controllers (route handlers)
import * as api_controller from "../controllers/api";
import * as passport_config from "../config/passport";
import libraryRouter from "./library";



const router = express.Router();
/**
 * API examples routes.
 */
router.get("/", api_controller.getApi);
router.get("/facebook", passport_config.isAuthenticated, passport_config.isAuthorized, api_controller.getFacebook);
router.use("/library", libraryRouter);


export default router;
