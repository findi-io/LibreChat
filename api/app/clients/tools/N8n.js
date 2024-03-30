const { Tool } = require('langchain/tools');
const { logger } = require('~/config');

class N8n extends Tool {
  constructor(fields = {}) {
    super();
    this.url = fields.N8N_URL;
    this.apiKey = fields.N8N_API_KEY;
  }
  name = 'n8n';
  description = 'Use the \'n8n\' tool to save workflow to server';
  description_for_model = 'Use the \'n8n\' tool to save the workflow json to remote server';

  async _call(input) {
    logger.warn('call tool');
    try {
      const response = await fetch(`${this.url}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        body: input,
      });
      if (response.status === 200) {
        return 'workflow saved';
      } else {
        return 'failed to save workflow';
      }
    } catch (error) {
      return 'failed to save workflow';
    }
  }
}

module.exports = N8n;
