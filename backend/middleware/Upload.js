const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Upload Config
const uploadConfig = {
    serviceImage: "services",
    blogImage: "blogs",
    industryImage: "industries",
    resume: "resumes",
    video: "videos",
};

// Storage (Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const folder = uploadConfig[file.fieldname];

        if (!folder) {
            throw new Error("Invalid file field name");
        }

        return {
            folder,
            resource_type: "auto", // image/video/pdf sab support
        };
    },
});

// Limits
const limits = {
    fileSize: 5 * 1024 * 1024,
};

const upload = multer({ storage, limits });

module.exports = upload;