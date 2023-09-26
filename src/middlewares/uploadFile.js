const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
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