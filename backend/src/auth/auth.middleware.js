import jwt from "jsonwebtoken";


// VERIFY TOKEN
export const verifyToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ success: false, message: "Invalid authorization header" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
export const checkRole = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();

  };

};

export const requireAdmin = checkRole("admin");
