const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { sendEmail } = require('~/server/utils');

class Email extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.senderEmail = fields.senderEmail;
    this.sender = fields.sender;
    this.messages = fields.messages;
    this.conversationId = fields.conversationId;
  }
  name = 'email';
  description = 'send the conversation by email';
  description_for_model = 'send email, no input needed';

  async _call(input) {
    logger.warn('call tool ' + input);
    try {
      const emailEnabled =
        (!!process.env.EMAIL_SERVICE || !!process.env.EMAIL_HOST) &&
        !!process.env.EMAIL_USERNAME &&
        !!process.env.EMAIL_PASSWORD &&
        !!process.env.EMAIL_FROM;

      if (emailEnabled) {
        sendEmail(
          this.senderEmail,
          `Your chat conversation ${this.conversationId}`,
          {
            name: this.sender,
            hello: 'world',
            conversationId: this.conversationId,
            messages: this.messages,
            link: `https://chat.chatlog.ai/c/${this.conversationId}`,
          },
          'email.handlebars',
        );
      }
      // console.log(result)
    } catch (error) {
      logger.error('Failed to send email.');
    }
    return 'email sent out';
  }
}

module.exports = Email;
