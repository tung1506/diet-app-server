// src/config/cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dnzll7aay',
    api_key: '814374983664539',
    api_secret: 'f5qC_zuwcb_Al5CfgMS08BXY5-s',
});

module.exports = cloudinary;