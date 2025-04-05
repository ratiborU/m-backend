import jwt from "jsonwebtoken";

class TokenService {
  async generateToken(params, time) {
    return jwt.sign(
      { ...params },
      process.env.SECRET_KEY,
      { expiresIn: time }
    )
  }

  async generateJwtAccessAndRefresh(params) { //id, email, role
    return ({
      accessToken: await this.generateToken(params, '1h'),
      refreshToken: await this.generateToken(params, '7d'),
    })
  }
}

export default new TokenService;