const jwt = require("jsonwebtoken");


// VERIFY TOKEN
exports.verifyToken = (req, res, next) => {

  try {

    // GET AUTH HEADER
    const authHeader = req.headers.authorization;

    // CHECK TOKEN EXISTS
    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "No token provided"
      });

    }

    // EXTRACT TOKEN
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // SAVE USER INFO
    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });

  }

};



// ROLE MIDDLEWARE
exports.checkRole = (...roles) => {

  return (req, res, next) => {

    // CHECK ROLE
    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        success: false,
        message: "Access denied"
      });

    }

    next();

  };

};