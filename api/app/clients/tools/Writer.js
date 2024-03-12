const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require( "@langchain/core/output_parsers");

class Writer extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.senderEmail = fields.senderEmail;
    this.sender = fields.sender;
    this.messages = fields.messages;
    this.conversationId = fields.conversationId;
    const appId = fields.appId;
    this.apiKey = fields.apiKey
    this.url = `https://${appId}.collab.tiptap.cloud/api/documents/doc_${this.conversationId}?format=json`
  }
  name = 'writer';
  description = 'Writing according request';
  description_for_model = 'This is a document read and write tool, it process document in html format. when input is empty it will return the document, when the input is not empty, it will save the input into document.';

  async _call(input) {
    logger.warn('call tool ' + input);
    try {
      console.log(input);
      return "done"
    } catch (error) {
      logger.error('Failed to process request. {}',error);
    }
    return 'the tool is failed to process the request';
  }
}

module.exports = Writer;
