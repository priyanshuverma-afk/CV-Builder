const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authRouter = Router()

/**
*@route Post
*@description Register a new user
*@access Public
*/
authRouter.post("/register",authController.registerUserController)


/**
 * @route Post /api/ auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)

module.exports = authRouter