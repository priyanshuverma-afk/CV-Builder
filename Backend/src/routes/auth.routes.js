const { Router } = require('express')
const authController = require("../controllers/auth.controller")
const authRouter = Router()
const { authUser } = require("../middlewares/auth.middleware")

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


/**
 * @router GET /api/auth/logout
 * @description Logout user by clearing the token cookie and adding the token to blacklist
 * @access public
 */
    authRouter.get("/logout", authController.logoutUserController)



    /**
     * @route Get/api/auth/getUser
     * @description Get the current logged in user details, expects a valid JWT token in the cookie
     * @access private
     */
    authRouter.get("/getUser", authUser, authController.getUserController)
module.exports = authRouter