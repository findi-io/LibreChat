const express = require('express');
const AskController = require('~/server/controllers/AskController');
const { initializeClient } = require('~/server/services/Endpoints/workflow');
const {
  handleAbort,
  setHeaders,
  validateModel,
  validateEndpoint,
  buildEndpointOption,
  moderateText,
} = require('~/server/middleware');

const router = express.Router();
router.use(moderateText);
router.post('/abort', handleAbort());

router.post(
  '/',
  validateEndpoint,
  validateModel,
  buildEndpointOption,
  setHeaders,
  async (req, res, next) => {
    await AskController(req, res, next, initializeClient);
  },
);

module.exports = router;
