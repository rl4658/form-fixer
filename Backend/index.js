
const express = require("express")
const app = express()

const authenticateToken = require("./Middleware/JwtAuth.js")
const { Logger } = require("./Middleware/Logger.js")
require('dotenv').config();

const userRoutes = require("./Routes/UserRoutes.js")


//Middleware 
app.use(express.json()); //parse JSON Data
app.use(Logger)

//Routes
app.use("/users", userRoutes)
app.use("/dashboard", authenticateToken);



// Start the server
app.listen(3000, '192.168.2.19', async () => {
    console.log('Server running on port 3000');
});
