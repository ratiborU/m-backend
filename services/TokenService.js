class TokenService {
    async generateToken(params, time) {
        return jwt.sign(
            { ...params }, 
            process.env.SECRET_KEY,
            {expiresIn: time}
        )
    }

    async generateJwtAccessAndRefresh(params, time) { //id, email, role
        return ({
            accessToken: generateToken(params, '30m'),
            refreshToken: generateToken(params, '30d'),
        })
    }
}

export default new TokenService;