import jwt from 'jsonwebtoken';

export default function optionalAuth(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Изменено с req.body.userId на req.userId
    next();
  } catch (e) {
    next();
  }
}
