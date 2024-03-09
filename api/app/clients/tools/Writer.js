const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { sendEmail } = require('~/server/utils');

class Writer extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.senderEmail = fields.senderEmail;
    this.selection = fields.selection
    this.sender = fields.sender;
    this.messages = fields.messages;
    this.conversationId = fields.conversationId;
  }
  name = 'writer';
  description = 'Writing according request';
  description_for_model = 'writing according user input';

  async _call(input) {
    logger.warn('call tool ' + input);
    try {

      console.log(this.selection)
      // console.log(result)
    } catch (error) {
      logger.error('Failed to send email.');
    }
    return 'email sent out';
  }
}

module.exports = Writer;
