const multer = require('multer');
const s3 = require('../Infrastructure/aws');

const upload = multer({ storage: multer.memoryStorage() });
const bucketName = process.env.AWS_BUCKET_NAME;

const uploadToS3 = async (file) => {
    const fileKey = `${Date.now()}-${file.originalname}`;
    const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        console.log('Iniciando upload para o S3...');
        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        throw new Error(`Erro ao fazer upload para o S3: ${error.message}`);
    }
};

const listImagesFromS3 = async () => {
    const params = { Bucket: bucketName };
    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.map(item => `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`);
    } catch (error) {
        throw new Error(`Erro ao listar imagens no S3: ${error.message}`);
    }
};

module.exports = {
    upload,
    uploadToS3,
    listImagesFromS3
};
