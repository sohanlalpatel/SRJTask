const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Upload Config
const uploadConfig = {
    serviceImage: {
        folder: "services",
        allowed: /\.(jpg|jpeg|png|webp|avif)$/i,
    },
    blogImage: {
        folder: "blogs",
        allowed: /\.(jpg|jpeg|png|webp|avif)$/i,
    },
    bannerImage: {
        folder: "banners",
        allowed: /\.(jpg|jpeg|png|webp|avif)$/i,
    },
    resume: {
        folder: "resumes",
        allowed: /\.(pdf|doc|docx)$/i,
    },
    video: {
        folder: "videos",
        allowed: /\.(mp4|mov|avi|mkv)$/i,
    },
};

// Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const config = uploadConfig[file.fieldname];

        if (!config) {
            return cb(new Error("Invalid file field name"), null);
        }

        const folder = path.join(__dirname, "..", "uploads", config.folder);
        ensureDirectoryExists(folder);

        cb(null, folder);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext).replace(/\s+/g, "-");
        const uniqueName = `${Date.now()}-${base}${ext}`;
        cb(null, uniqueName);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    const config = uploadConfig[file.fieldname];

    if (!config) return cb(new Error("Invalid file field name"), false);

    if (config.allowed.test(file.originalname)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
};

// Limits
const limits = {
    fileSize: 3 * 1024 * 1024, // 3MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;