require("dotenv").config({ path: "./src/.env" });

const app = require("./app");
const connectDb = require("./config/database");

async function startServer() {
    try {
        await connectDb();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.log(err);
    }
}

startServer();