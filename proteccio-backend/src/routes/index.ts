import express from "express";
import IndexController from "../controllers/index-controller";
import safeControllerFunction from "../shared/safe-controller-function";

const router = express.Router({strict: false});

router.use(IndexController.use);

router.get("/", IndexController.Proteccio);
router.get("/pricing", IndexController.pricing);
router.get("/privacy-policy", IndexController.privacyPolicy);
router.get("/terms-of-use", IndexController.termsOfUse);
router.get(["/session-expired", "/authenticate"], IndexController.redirectToLogin);
router.get("/auth/signup", safeControllerFunction(IndexController.signup));
router.get("/auth/login", safeControllerFunction(IndexController.login));
router.get(["/teams"], IndexController.admin);
router.get(["/auth", "/auth/**"], IndexController.auth);
router.get(["/Proteccio", "/Proteccio/**"], IndexController.Proteccio);
// New Proteccio route prefix (matches the frontend's updated routing)
router.get(["/proteccio", "/proteccio/**"], IndexController.Proteccio);

export default router;
