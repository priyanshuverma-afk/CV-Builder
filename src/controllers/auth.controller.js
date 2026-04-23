const userModel = require("../models/user.models");
const authRouter = require("../routes/auth.routes");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/***@route Post
*@description Register a new user
*@access Public
*/
async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }

    const isUserAlreadyExist = await userModel.findOne({ $or: [{ email }, { username }] })
    if (isUserAlreadyExist) {
        return res.status(400).json({ message: "User already exists with this email or username" })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = new userModel({
        username: username,   
        email,
        password: hash
    })

    await newUser.save()   

    const token = jwt.sign(
        { id: newUser._id, username: newUser.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
        }
    })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body, returns a JWT token if successful
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        console.log("Login request received with body:", req.body); // Debugging log
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    })
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
/**
 * @name logoutUserController
 * @description Logout user by clearing the token cookie and adding the token to blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token
        if (token) {
            await tokenBlacklistModel.create({ token })
        }
        res.clearCookie("token")
        res.status(200).json({ message: "User logged out successfully" })
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @name getUserController
 * @description Get the current logged in user details, expects a valid JWT token in the cookie
 * @access private
 */

async function getUserController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)
        res.status(200).json({
            message: "User details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    getUserController,
    logoutUserController
}