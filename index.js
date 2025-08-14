const express = require('express');
const cors = require("cors");
const app = express();

// Load Sequelize and models
const db = require("./models");

// Route files
const collectionRoutes = require("./routes/collectionRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", collectionRoutes);

// DB Connection
db.sequelize.sync()
  .then(() => {
    console.log("Database connection has been established successfully :3");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Running on the port http://localhost:${port}`);
});