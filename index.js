const express = require('express');
const cors = require("cors");
const app = express();
const authCheck = require('./middleware/authCheck')

// Load Sequelize and models
const db = require("./models");

// Route files
const collectionRoutes = require("./routes/collectionRoutes");

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/protected', authCheck, (req, res) => {
  // Handle the protected endpoint logic
  res.json({ message: 'You accessed a protected endpoint!' });
});

// Routes
app.use("/api", authCheck, collectionRoutes);

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