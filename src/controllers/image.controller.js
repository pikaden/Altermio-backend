const { handleUpload } = require('../services/image.service');
const httpStatus = require('http-status');
const { uploadFileMiddleware, singleUploadMiddleware, multipleUploadsMiddleware } = require('../middlewares/uploadFile');
const { imageService } = require('../services');

const handlerSingleUpload = async (req, res) => {
    try {
        await uploadFileMiddleware(req, res, singleUploadMiddleware);
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // save image in cloud then save in mongodb
        const cldRes = await handleUpload(dataURI);
        const image = await imageService.handleImageUpload(cldRes.public_id, cldRes.secure_url);
        res.status(httpStatus.OK).json({ image: image });
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

        var imageList = [];

        // map through images and create a promise array using cloudinary upload function
        await Promise.all(pictureFiles.map(async (picture) => {
            const b64 = Buffer.from(picture.buffer).toString("base64");
            let dataURI = "data:" + picture.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI);
            const image = await imageService.handleImageUpload(cldRes.public_id, cldRes.secure_url);
            imageList.push(image);
        }));

        res.status(httpStatus.OK).json({ images: imageList });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.NO_CONTENT).send({
            message: error.message,
        });
    }
}

const handlerDeleteSingleFile = async (req, res) => {
    try {
        // get imageId => search image => get public_id => delete on cloud
        const imageId = req.params.imageId;
        const image = await imageService.getImageById(imageId);
        await imageService.handleDelete(image.public_id);

        // delete on server
        // TODO: also delete reference in User (single => User, multiple => Product)
        await image.remove();
        res.status(httpStatus.NO_CONTENT).send();
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
    handlerMultipleUploads,
    handlerDeleteSingleFile
};