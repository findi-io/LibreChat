const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);

class N8nSave extends Tool {
  constructor(fields = {}) {
    super();
    this.url = fields.N8N_URL;
    this.apiKey = fields.N8N_API_KEY;
  }
  name = 'n8nsave';
  description = 'save n8n workflow to server';
  description_for_model = 'save n8n workflow json to server';

  async _call(input) {
    logger.warn('call tool');
    try {
      let json = JSON.parse(input);
      if (json.workflow) {
        if (json.name) {
          const name = json.name;
          json = json.workflow;
          json.name = name;
        }
      }
      if (!json.settings) {
        json.settings = {
          saveExecutionProgress: true,
          saveManualExecutions: true,
          saveDataErrorExecution: 'all',
          saveDataSuccessExecution: 'all',
          executionTimeout: 3600,
          errorWorkflow: 'VzqKEW0ShTXA5vPj',
          timezone: 'America/New_York',
        };
      }
      if (!json.staticData) {
        json.staticData = {
          lastId: 1,
        };
      }
      if (!json.name) {
        json.name = 'Workflow ' + nanoid();
      }
      const response = await fetch(`${this.url}/api/v1/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        body: JSON.stringify(json),
      });
      if (response.status === 200) {
        const body = await response.text();
        return `
        \`\`\`n8n
        ${body}
        \`\`\`
        `;
      } else {
        return 'failed to save workflow';
      }
    } catch (error) {
      return 'failed to save workflow';
    }
  }
}

module.exports = N8nSave;
