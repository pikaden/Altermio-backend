const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 // 1MB per file
    },
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb(new Error('file is not allowed'))
        }

        cb(null, true)
    }
});
const whitelist = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    // this should be only for testing purpose!!!
    'multipart/form-data'
]
const MAX_COUNT = 5;

const singleUploadMiddleware = upload.single("myFile");
const multipleUploadsMiddleware = upload.array("images", MAX_COUNT);

const uploadFileMiddleware = (req, res, fn) => {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

module.exports = {
    singleUploadMiddleware,
    multipleUploadsMiddleware,
    uploadFileMiddleware
}