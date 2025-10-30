import { Router } from "express";
import { register, login ,addScore ,fetchScore ,fetchAllScore} from "../controllers/authController";

const router = Router();

router.post("/signup", register);
router.post("/login", login);
router.post("/addScore", addScore);
router.post("/fetchScore", fetchScore);
router.post("/fetchAllScore", fetchAllScore);

export default router;
