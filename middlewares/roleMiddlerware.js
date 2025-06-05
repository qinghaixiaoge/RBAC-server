const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send({ code: false, msg: "权限不足", data: null })
        }
        next()
    }
}

module.exports = authorizeRoles