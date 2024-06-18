import JWT from 'jsonwebtoken'
const userAuth = async (req, res, next) => {
    const AuthHeader = req.headers.authorization
    if (!AuthHeader || !AuthHeader.startsWith('Bearer')) {
        next('Auth Failed')
    }
    const Token = AuthHeader.split(' ')[1]
    try {
        const payload = JWT.verify(Token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId }
        next()
    } catch (err) {
        next('Authentication Failed')
    }
}
export default userAuth;