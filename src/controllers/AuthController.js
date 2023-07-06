import { Router } from "express";
import AuthService from "../services/AuthService.js";
import { check, body } from "express-validator";

const router = Router();

/**
 * @route       POST api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.post('/login', [
    body("user", "User is required").exists().isObject(),
], AuthService.login);

/**
 * @route       POST api/auth
 * @description register user & get token
 * @access      Public
 */
router.post('/register', AuthService.signup);

/**
 * @route       GET api/auth
 * @description Authenticate user & get token
 * @access      Public
 */
router.get('/', AuthService.isAuth);

export default router;