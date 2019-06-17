const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // - Nếu ko có header là 'Authorization' thì sẽ bị undefined.replace() --> lỗi,
        // mà mình đã dùng try-catch rồi, nên nó chạy vô catch luôn.
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // decoded lúc này chính là payload mình đã đưa vào lúc encode
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        // Nếu ko tìm đc user (với _id và token c/c) thì quăng error để trigger catch block
        if (!user) throw new Error()

        req.token = token // Đính kèm token đã check ok để tiện delete token đó trong db khi logout
        req.user = user // Đính kèm thông tin user đã xác thực vô req luôn
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' }) 
    }
}

module.exports = auth