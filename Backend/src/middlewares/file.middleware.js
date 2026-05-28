const multer = require("multer")


const upload = multer({
    storage:multer.memoryStorage(),
    limits: {
        filesiSize: 3 * 1024 * 1024// 3Mb
    }
})


module.exports = upload