const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const discussionController = require("../controllers/discussionController");

router.post('/chat', authMiddleware(["Student"]), discussionController.addChat );
router.get('/unit/:unitId/messages', authMiddleware(["Student", "Instructor"]), discussionController.getMessageByUnit);
router.post('/reply', authMiddleware(["Instructor"]), discussionController.replyToMessage);

module.exports = router;