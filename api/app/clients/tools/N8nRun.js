const { Tool } = require('langchain/tools');
const { logger } = require('~/config');

class N8nRun extends Tool {
  constructor(fields = {}) {
    super();
    this.url = fields.N8N_RUN_URL;
    this.apiKey = fields.N8N_RUN_API_KEY;
  }
  name = 'n8nrun';
  description = 'Run n8n workflow';
  description_for_model = 'run n8n workflow, input workflow webhook id';

  async _call(input) {
    logger.warn('call tool', input);
    try {
      console.log('params', this.url, this.apiKey);
      const response = await fetch(`${this.url}/api/v1/workflows?active=true&name=${input}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
      });
      if (response.status === 200) {
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          console.log('found item');
          const node = json.data[0].nodes.find((node) => node.webhookId);
          console.log('nodes:', node);
          if (node) {
            const response2 = await fetch(`${this.url}/webhook/${node.webhookId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': this.apiKey,
              },
            });
            return await response2.text();
          } else {
            return 'the workflow doesn\'t have webhook trigger';
          }
        } else {
          return 'workflow not found or not activated';
        }
      } else {
        return 'failed to run workflow1';
      }
    } catch (error) {
      logger.warn(error);
      return 'failed to run workflow2';
    }
  }
}

module.exports = N8nRun;
