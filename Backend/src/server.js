require("dotenv").config({ path: "./src/.env" });

const app = require("./app");
const connectDb = require("./config/database");
const invokeGemniAi = require("./services/ai.service");

async function startServer() {
    try {
        await connectDb();
        await invokeGemniAi();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();