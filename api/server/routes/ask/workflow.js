const express = require('express');
const AskController = require('~/server/controllers/AskController');
const { addTitle, initializeClient } = require('~/server/services/Endpoints/workflow');
const { handleAbort, setHeaders, validateEndpoint, moderateText } = require('~/server/middleware');

const router = express.Router();
router.use(moderateText);
router.post('/abort', handleAbort());

router.post('/', validateEndpoint, setHeaders, async (req, res, next) => {
  await AskController(req, res, next, initializeClient, addTitle);
});

module.exports = router;
