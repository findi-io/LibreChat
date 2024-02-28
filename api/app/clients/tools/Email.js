const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { Resend } = require('resend');

const { MagicLinkEmail } = require('~/email/magic-email-link');

class Email extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.senderEmail = fields.senderEmail;
    this.sender = fields.sender;
    this.conversationId = fields.conversationId;
    this.resend = new Resend(fields.apiKey);
    console.log(fields);
  }
  name = 'email';
  description = 'send the conversation by email';
  description_for_model = 'send email, no input needed';

  async _call(input) {
    logger.warn('call tool ' + input);
    try {
      await this.resend.emails.send({
        from: 'Chatlog App <onboarding@chatlog.ai>',
        to: `${this.sender}<${this.senderEmail}>`,
        subject: `your chat conversation ${this.conversationId}`,
        react: MagicLinkEmail({
          firstName: this.sender,
          actionUrl: `https://chat.chatlog.ai/c/${this.conversationId}`,
          mailType: 'login',
          siteName: 'Chatlog App',
        }),
        // Set this to prevent Gmail from threading emails.
        // More info: https://resend.com/changelog/custom-email-headers
        headers: {
          'X-Entity-Ref-ID': new Date().getTime() + '',
        },
      });

      // console.log(result)
    } catch (error) {
      throw new Error('Failed to send verification email.');
    }
    return 'email sent out';
  }
}

module.exports = Email;
