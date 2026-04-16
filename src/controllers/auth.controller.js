const userModel = require("../models/user.models");
const authRouter = require("../routes/auth.routes");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/***@route Post
*@description Register a new user
*@access Public
*/
async function registerUserController(req, res) {

    const { Username, email, password } = req.body

    if (!Username || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" })
    }

    const isUserAlreadyExist = await userModel.findOne({ $or: [{ email }, { Username }] })
    if (isUserAlreadyExist) {
        return res.status(400).json({ message: "User already exists with this email or username" })
    }

    const hash = await bcrypt.hash(password, 10)

    const newUser = new userModel({
        username: Username,   // ⚠️ yaha bhi fix kiya
        email,
        password: hash
    })

    await newUser.save()   // ⚠️ ye missing tha

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
}


/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body, returns a JWT token if successful
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
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
}
module.exports = {
    registerUserController,
    loginUserController
}