
const checkPermission = (allowedPermission) => {
    return (req, res, next) => {
        if (!req.user.permissions.includes(allowedPermission)) {
            return res.status(403).send({ code: false, msg: "权限不足", data: null })
        }
        next()
    }
}

module.exports = checkPermission