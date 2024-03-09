const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');

const { z } = require('zod');
const { StructuredOutputParser } = require('langchain/output_parsers');


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
    const appId = fields.appId;
    this.apiKey = fields.apiKey
    this.url = `https://${appId}.collab.tiptap.cloud/api/documents/doc_${this.conversationId}?format=json`
  }
  name = 'writer';
  description = 'Writing according request';
  description_for_model = 'writing according user input, just pass raw user prompt as input';
  llm = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo-16k' });

  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  parser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().optional().describe('answer from chatbot'),
      doc: z
        .string()
        .optional()
        .describe('tiptap editor document in json format'),
    }),
  );
  async _call(input) {
    logger.warn('call tool ' + input);
    try {

      console.log(input);

      const res = await fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

        headers: {
          "Content-Type": "application/json",
          'Authorization': this.apiKey,
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-ur
      });


      const chain = RunnableSequence.from([
        PromptTemplate.fromTemplate(
          'This is an TipTap document in json format {document}. \n\n user selection in document is {}\n modify the document and return the same json format according the instruction {format_instructions}\n Modification command: \n {question}',
        ),
        this.llm,
        this.parser,
      ]);
      const jsonData = await res.json()
      console.log(this.parser.getFormatInstructions());

      const response = await chain.invoke({
        question: input,
        document: jsonData,
        selection: this.selection,
        format_instructions: this.parser.getFormatInstructions(),
      });

      console.log(JSON.stringify(response));
      await fetch(url, {
        method: "PATCH", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached

        headers: {
          "Content-Type": "application/json",
          'Authorization': this.apiKey,
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-ur
        body: response.doc
      });
      return response.answer
    } catch (error) {
      logger.error('Failed to process request. {}',error);
    }
    return 'the tool is failed to process the request';
  }
}

module.exports = Writer;
