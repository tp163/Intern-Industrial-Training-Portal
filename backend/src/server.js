const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./auth/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());


// AUTH ROUTES
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("Backend Running");
});




const {
  verifyToken,
  checkRole
} = require("./auth/auth.middleware");

// STUDENT DASHBOARD
app.get(
  "/student/dashboard",

  verifyToken,

  checkRole("STUDENT"),

  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Student",
      user: req.user
    });

  }
);

// ADMIN DASHBOARD
app.get(
  "/admin/dashboard",

  verifyToken,

  checkRole("ADMIN"),

  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user
    });

  }
);

// SUPERVISOR DASHBOARD
app.get(
  "/supervisor/dashboard",

  verifyToken,

  checkRole("SUPERVISOR"),

  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Supervisor",
      user: req.user
    });

  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});