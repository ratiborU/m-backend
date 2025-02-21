import jwt from "jsonwebtoken";

const checkRoleMiddleWare = (role) => {
  return (req, res, next) => {
    if (req.method == "OPTIONS") {
      next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role == "PERSON" && role == "ADMIN") {
        return res.status(403).json({ message: 'У пользователя нет доступа' });
      }
      req.person = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
  };
};

export { checkRoleMiddleWare };