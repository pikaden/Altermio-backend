const { handleUpload } = require('../services/image.service');
const httpStatus = require('http-status');
const { uploadFileMiddleware, singleUploadMiddleware, multipleUploadsMiddleware } = require('../middlewares/uploadFile');

const handlerSingleUpload = async (req, res) => {
    try {
        await uploadFileMiddleware(req, res, singleUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const cldRes = await handleUpload(dataURI);
        res.status(httpStatus.OK).json({ image: cldRes });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
};

const handlerMultipleUploads = async (req, res) => {
    try {
        await uploadFileMiddleware(req, res, multipleUploadsMiddleware);

        let pictureFiles = req.files;
        if (!pictureFiles) return res.status(400).json({ message: "No picture attached!" });

        var imageUrlList = [];

        // map through images and create a promise array using cloudinary upload function
        await Promise.all(pictureFiles.map(async (picture) => {
            const b64 = Buffer.from(picture.buffer).toString("base64");
            let dataURI = "data:" + picture.mimetype + ";base64," + b64;
            const imageUrl = await handleUpload(dataURI);
            imageUrlList.push(imageUrl);
        }));

        res.status(httpStatus.OK).json({ images: imageUrlList });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
}

const config = {
    api: {
        bodyParser: false,
    },
};

module.exports = {
    config,
    handlerSingleUpload,
    handlerMultipleUploads
};