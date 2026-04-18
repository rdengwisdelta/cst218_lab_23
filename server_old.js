const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 3000;


// middleware to read JSON from requests
app.use(express.json());


// middleware requests info
app.use((req, res, next) => {
  console.log("Request received for:", req.url);
  console.log("Request method", req.method);
  console.log("Requested path:", req.path);
  next();
});


// force Node DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


// connect to MongoDB (local or Atlas connection string)
const MONGO_URI = "mongodb+srv://test_user:YouShallNotPass119@cst218.nfaquzy.mongodb.net/?appName=CST218";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


// routes
const recipesRouter = require("./routes/routes");
const authRouter = require("./routes/authRoutes");

app.use("/recipes", recipesRouter);
app.use("/auth", authRouter);


// test route
app.get("/", (req, res) => res.send("Server running"));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));