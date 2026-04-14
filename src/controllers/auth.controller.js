const userModel = require("../models/user.models");
const authRouter = require("../routes/auth.routes");


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

}


module.exports = {
    registerUserController
}