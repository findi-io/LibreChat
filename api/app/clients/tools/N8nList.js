const { Tool } = require('langchain/tools');
const { logger } = require('~/config');

class N8nList extends Tool {
  constructor(fields = {}) {
    super();
    this.url = fields.N8N_LIST_URL;
    this.apiKey = fields.N8N_LIST_API_KEY;
  }
  name = 'n8n';
  description = 'Use the \'n8n\' tool to save workflow to server';
  description_for_model = 'Use the \'n8n\' tool to save the workflow json to remote server';

  async _call() {
    logger.warn('call tool');
    try {
      const response = await fetch(`${this.url}/api/v1/workflows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
      });
      if (response.status === 200) {
        const body = await response.text();
        return body;
      } else {
        return 'failed to list workflow';
      }
    } catch (error) {
      return 'failed to list workflow';
    }
  }
}

module.exports = N8nList;
