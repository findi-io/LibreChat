const express = require('express');
const router = express.Router();
const collaborationController = require('~/server/controllers/CollaborationController');

router.post('/', collaborationController);

module.exports = router;
