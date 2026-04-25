const jwt = require('jsonwebtoken');

// Protects customer routes — checks for a valid JWT in the Authorization header
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorised, token invalid' });
  }
};

// Protects admin routes — uses a separate secret so admin tokens can never work on customer routes
const adminProtect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorised, token invalid' });
  }
};

module.exports = { protect, adminProtect };
