const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { v4: uuidv4 } = require('uuid');
const { FileContext } = require('librechat-data-provider');

const { z } = require('zod');
const { StructuredOutputParser } = require('langchain/output_parsers');

class Chart extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.fileStrategy = fields.fileStrategy;
    console.log('strategy:' + this.fileStrategy);
    if (fields.processFileURL) {
      this.processFileURL = fields.processFileURL.bind(this);
    }
  }
  name = 'chart';
  description = 'Use the \'chart\' tool to generate data chart image';
  description_for_model = 'provide chart type [pie,bar,line] and data, if no chart type mentioned';

  wrapInMarkdown(imageUrl) {
    return `![generated image](${imageUrl})`;
  }

  llm = new ChatOpenAI({ temperature: 0, modelName: 'gpt-4-turbo-preview' });

  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  parser = StructuredOutputParser.fromZodSchema(
    z.object({
      type: z.string().optional().describe('chart type [pie, bar, line] defaut as bar'),
      data: z
        .object({
          labels: z.array(z.string()).describe('labels for X-axis'),

          datasets: z
            .array(
              z.object({
                label: z.string().describe('label for the dataset'),
                data: z.array(z.number()).describe('data to render in chart'),
              }),
            )
            .describe('dataset for chart'),
        })
        .optional()
        .describe('data object containing the data to draw the chart'),
    }),
  );

  async _call(input) {
    logger.warn('----------call tool----------');
    console.log(input);
    const chain = RunnableSequence.from([
      PromptTemplate.fromTemplate(
        'Extract information according the instruction.\n{format_instructions}\n{question}',
      ),
      this.llm,
      this.parser,
    ]);

    console.log(this.parser.getFormatInstructions());

    const response = await chain.invoke({
      question: input,
      format_instructions: this.parser.getFormatInstructions(),
    });
    if (!response.type) {
      response.type = 'bar';
    }
    console.log(JSON.stringify(response));

    const imageName = `img-${uuidv4()}.png`;
    try {
      const result = await this.processFileURL({
        fileStrategy: this.fileStrategy,
        userId: this.userId,
        URL: 'https://quickchart.io/chart?c=' + JSON.stringify(response),
        fileName: imageName,
        basePath: 'images',
        context: FileContext.image_generation,
      });

      this.result = this.wrapInMarkdown(result.filepath);
    } catch (error) {
      logger.error('Error while saving the image:', error);
      this.result = `Failed to save the image locally. ${error.message}`;
    }

    return this.result;
  }
}

module.exports = Chart;
