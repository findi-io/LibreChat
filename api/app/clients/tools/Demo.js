const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { DataSource } = require('typeorm');
const { SqlDatabase } = require('langchain/sql_db');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnablePassthrough, RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require('@langchain/core/output_parsers');

class Demo extends Tool {
  constructor() {
    super();
  }
  name = 'demo';
  description = 'Use the \'demo\' tool to search data from sql database';
  description_for_model = 'Use the \'demo\' tool to search data from sql database';
  datasource = new DataSource({
    type: 'postgres',
    host: 'ep-billowing-night-a4ozbph0.us-east-1.aws.neon.tech',
    port: 5432,
    username: 'default',
    password: 'zsSZ6BNGh8Lg',
    database: 'verceldb',
    ssl: true,
  });

  llm = new ChatOpenAI({ temperature: 0, modelName: 'gpt-4-turbo-preview' });
  async _call(input) {
    logger.warn('call tool');
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: this.datasource,
    });
    const schema = await db.getTableInfo();
    const prompt = PromptTemplate.fromTemplate(`example output: 
      select * from customers
      select count(*) as count from employee
      
      Based on the table schema below, print out SQL statement works for Postgresql that would answer the user's question:
      {schema}

      Question: {question}
      SQL Query:`);
    const sqlQueryGeneratorChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        schema: async () => schema,
      }),
      prompt,
      this.llm.bind({ stop: ['\nSQLResult:'] }),
      new StringOutputParser(),
    ]);
    /*
        {
          result: "SELECT COUNT(EmployeeId) AS TotalEmployees FROM Employee"
        }
      */

    const finalResponsePrompt =
      PromptTemplate.fromTemplate(`Based on the table schema below, question, sql query, and sql response, write a natural language response:
      {schema}
      
      Question: {question}
      SQL Query: {query}
      SQL Response: {response}`);

    const fullChain = RunnableSequence.from([
      RunnablePassthrough.assign({
        query: sqlQueryGeneratorChain,
      }),
      {
        schema: () => schema,
        question: () => input,
        query: (input) => {
          console.log('---------------');
          console.log(input);
          console.log('--------------');
          return input.query;
        },
        response: (input) => db.run(input.query),
      },
      finalResponsePrompt,
      this.llm,
    ]);

    const finalResponse = await fullChain.invoke({
      question: input,
    });

    finalResponse.name = 'demo';
    finalResponse.includes = () => {};
    return finalResponse;
  }
}

module.exports = Demo;
