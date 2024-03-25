const OpenAIClient = require('./OpenAIClient');
const { logger } = require('~/config');

class WorkflowClient extends OpenAIClient {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    if (this.options.debug) {
      logger.debug('[WorkflowClient] init');
    }
    this.buildPrompt = this.ChatGPTClient.buildPrompt.bind(this);
    this.getCompletion = this.ChatGPTClient.getCompletion.bind(this);
    this.contextStrategy = options.contextStrategy
      ? options.contextStrategy.toLowerCase()
      : 'discard';
    this.shouldSummarize = this.contextStrategy === 'summarize';
    /** @type {AzureOptions} */
    this.azure = options.azure || false;
    this.setOptions(options);
    this.sender = 'Workflow';
  }

  async chatCompletion() {
    return 'hello world';
  }
}

module.exports = WorkflowClient;
