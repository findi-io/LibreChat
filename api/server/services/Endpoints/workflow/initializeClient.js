const { getUserKey, checkUserKeyExpiry } = require('~/server/services/UserService');
const { isEnabled, isUserProvided } = require('~/server/utils');
const { WorkflowClient } = require('~/app');

const initializeClient = async ({ req, res, endpointOption }) => {
  const { WORKFLOW_API_KEY, WORKFLOW_BASEURL, OPENAI_API_KEY, OPENAI_SUMMARIZE, DEBUG_OPENAI } =
    process.env;
  const { key: expiresAt, endpoint } = req.body;
  const contextStrategy = isEnabled(OPENAI_SUMMARIZE) ? 'summarize' : null;

  const userProvidesKey = isUserProvided(WORKFLOW_API_KEY);
  const userProvidesURL = isUserProvided(WORKFLOW_BASEURL);

  let userValues = null;
  if (expiresAt && (userProvidesKey || userProvidesURL)) {
    checkUserKeyExpiry(
      expiresAt,
      'Your OpenAI API values have expired. Please provide them again.',
    );
    userValues = await getUserKey({ userId: req.user.id, name: endpoint });
    console.log(userValues);
    try {
      userValues = JSON.parse(userValues);
    } catch (e) {
      throw new Error(
        `Invalid JSON provided for ${endpoint} user values. Please provide them again.`,
      );
    }
  }

  let apiKey = userProvidesKey ? userValues?.apiKey : WORKFLOW_API_KEY;
  let baseURL = userProvidesURL ? userValues?.baseURL : WORKFLOW_BASEURL;

  const clientOptions = {
    debug: isEnabled(DEBUG_OPENAI),
    contextStrategy,
    reverseProxyUrl: baseURL ? baseURL : null,
    proxy: null,
    req,
    res,
    ...endpointOption,
  };

  if (!apiKey) {
    throw new Error(`${endpoint} API key not provided. Please provide it again.`);
  }

  const client = new WorkflowClient(apiKey, clientOptions);
  return {
    client,
    openAIApiKey: OPENAI_API_KEY,
  };
};

module.exports = initializeClient;
