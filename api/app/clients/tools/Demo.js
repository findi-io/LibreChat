const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { DataSource } = require('typeorm');
const { SqlDatabase } = require('langchain/sql_db');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');

class Demo extends Tool {
  constructor() {
    super();
  }
  name = 'demo';
  description = 'Use the \'demo\' tool to search data from sql database';
  description_for_model = 'Use the \'demo\' tool to search data from sql database';
  datasource = new DataSource({
    type: 'sqlite',
    database: 'Chinook.sqlite',
  });
  llm = new ChatOpenAI();
  async _call(input) {
    console.log(input);
    logger.warn('call tool');
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: this.datasource,
    });
    const prompt =
      PromptTemplate.fromTemplate(`Based on the provided SQL table schema below, write a SQL query that would answer the user's question.
    ------------
    SCHEMA: {schema}
    ------------
    QUESTION: {question}
    ------------
    SQL QUERY:`);
    const sqlQueryChain = RunnableSequence.from([
      {
        schema: async () => db.getTableInfo(),
        question: (input) => input.question,
      },
      prompt,
      this.llm.bind({ stop: ['\nSQLResult:'] }),
      new StringOutputParser(),
    ]);

    const res = await sqlQueryChain.invoke({
      question: input,
    });
    console.log({ res });
    return res;
  }
}

module.exports = Demo;
