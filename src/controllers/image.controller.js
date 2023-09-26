const multer = require('multer');
const { handleUpload } = require('../services/image.service');
const httpStatus = require('http-status');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const myUploadMiddleware = upload.single("myFile");

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

const handler = async (req, res) => {
    try {
        await runMiddleware(req, res, myUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        res.json(cldRes);
        res.status(httpStatus.OK).send();
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
};

const config = {
    api: {
        bodyParser: false,
    },
};

module.exports = {
    config,
    handler
};