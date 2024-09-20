import jwt from "jsonwebtoken";

class TokenService {
    async generateToken(params, time) {
        return jwt.sign(
            { ...params }, 
            process.env.SECRET_KEY,
            {expiresIn: time}
        )
    }

    async generateJwtAccessAndRefresh(params) { //id, email, role
        return ({
            accessToken: await this.generateToken(params, '30m'),
            refreshToken: await this.generateToken(params, '30d'),
        })
    }
}

export default new TokenService;