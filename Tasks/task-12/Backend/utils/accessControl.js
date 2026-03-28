const accountModel = require("../schemas/accountSchema")

const checkAdminAccess = async(userId) => {
    const user = await accountModel.findById(userId)

    if(user.role === 'ADMIN'){
        return true
    }

    return false
}

module.exports = checkAdminAccess
