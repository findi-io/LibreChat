const { EModelEndpoint } = require('librechat-data-provider');
const { useAzurePlugins } = require('~/server/services/Config/EndpointService').config;
const {
  getOpenAIModels,
  getGoogleModels,
  getAnthropicModels,
  getChatGPTBrowserModels,
} = require('~/server/services/ModelService');

/**
 * Loads the default models for the application.
 * @async
 * @function
 * @param {Express.Request} req - The Express request object.
 */
async function loadDefaultModels(req) {
  const google = getGoogleModels();
  const openAI = await getOpenAIModels({ user: req.user.id });
  const anthropic = getAnthropicModels();
  const chatGPTBrowser = getChatGPTBrowserModels();
  const azureOpenAI = await getOpenAIModels({ user: req.user.id, azure: true });
  const gptPlugins = await getOpenAIModels({
    user: req.user.id,
    azure: useAzurePlugins,
    plugins: true,
  });
  const assistant = await getOpenAIModels({ assistants: true });

  return {
    [EModelEndpoint.openAI]: openAI,
    [EModelEndpoint.google]: google,
    [EModelEndpoint.anthropic]: anthropic,
    [EModelEndpoint.gptPlugins]: gptPlugins,
    [EModelEndpoint.azureOpenAI]: azureOpenAI,
    [EModelEndpoint.bingAI]: ['BingAI', 'Sydney'],
    [EModelEndpoint.workflow]: ['n8n'],

    [EModelEndpoint.chatGPTBrowser]: chatGPTBrowser,
    [EModelEndpoint.assistants]: assistant,
  };
}

module.exports = loadDefaultModels;
