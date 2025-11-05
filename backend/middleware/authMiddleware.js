const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(404).json({ message: "User not authorise." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
     res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = auth;
 