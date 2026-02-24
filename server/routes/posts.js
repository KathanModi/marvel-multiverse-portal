const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 📝 Add fan theories (CRUD)
router.get('/', postController.getPosts);
router.post('/', postController.createPost);

// 💬 Comment system
router.post('/:id/comments', postController.addComment);

module.exports = router;