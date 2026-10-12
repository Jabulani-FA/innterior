const express = require('express');
const multer = require('multer');
const { rateLimit } = require('express-rate-limit');
const { reimagine } = require('../controllers/roomDesign');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024, files: 1 },
});
const generationLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'You have reached the design limit. Try again in 15 minutes.' },
});

router.post('/room-design/reimagine', generationLimit, (req, res, next) => {
    upload.single('roomImage')(req, res, (error) => {
        if (error) {
            const message = error.code === 'LIMIT_FILE_SIZE'
                ? 'Room photos must be smaller than 8 MB.'
                : 'We could not read that room photo.';
            return res.status(400).json({ message });
        }
        next();
    });
}, reimagine);

module.exports = router;