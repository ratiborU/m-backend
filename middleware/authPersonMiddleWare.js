import jwt from "jsonwebtoken";

const authPersonMiddleWare = (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    console.log(decoded);

    // + query personId
    if (decoded.role != "ADMIN") {
      if ((req.method == 'GET' || req.method == 'DELETE') && decoded.id != req.params.id) {
        console.log(1);
        return res.status(403).json({ message: 'У пользователя нет доступа' });
      }
      if (req.method == 'PUT' && req.baseUrl == '/api/persons' && decoded.id != req.body.id) {
        return res.status(403).json({ message: 'У пользователя нет доступа' });
      }
      if (req.body.personId !== undefined && decoded.id != req.body.personId) {
        return res.status(403).json({ message: 'У пользователя нет доступа' });
      }
    }


    // if (decoded.role == "PERSON") {
    //   return res.status(403).json({ message: 'У пользователя нет доступа' });
    // }
    // добавить случай когда пользователь не активировал аккаунт
    req.person = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Пользователь не авторизован' });
  }
};

export { authPersonMiddleWare };