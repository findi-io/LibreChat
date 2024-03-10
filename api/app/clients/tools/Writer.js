const { Tool } = require('langchain/tools');
const { logger } = require('~/config');
const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { RunnableSequence } = require('@langchain/core/runnables');
const { StringOutputParser } = require( "@langchain/core/output_parsers");
const {Bold} = require( '@tiptap/extension-bold')
const {Document} = require( '@tiptap/extension-document')
const {Paragraph} = require( '@tiptap/extension-paragraph')
const {Text} = require( '@tiptap/extension-text')
const {Emoji} = require( '@tiptap-pro/extension-emoji')
const {Mathematics} = require( '@tiptap-pro/extension-mathematics')
const {TableOfContents} = require( '@tiptap-pro/extension-table-of-contents')
const {BulletList} = require( '@tiptap/extension-bullet-list')
const {CodeBlock} = require( '@tiptap/extension-code-block')
const {Heading} = require( '@tiptap/extension-heading')
const {HorizontalRule} = require( '@tiptap/extension-horizontal-rule')
const {Image} = require( '@tiptap/extension-image')
const {Link} = require( '@tiptap/extension-link')
const {OrderedList} = require( '@tiptap/extension-ordered-list')
const {Subscript} = require( '@tiptap/extension-subscript')
const {Superscript} = require( '@tiptap/extension-superscript')
const {Table} = require( '@tiptap/extension-table')
const {TableHeader} = require( '@tiptap/extension-table-header')
const {TableRow} = require( '@tiptap/extension-table-row')
const {TaskItem} = require( '@tiptap/extension-task-item')
const {TaskList} = require( '@tiptap/extension-task-list')
const {TextAlign} = require( '@tiptap/extension-text-align')
const {TextStyle} = require( '@tiptap/extension-text-style')
const {Typography} = require( '@tiptap/extension-typography')
const {Underline} = require( '@tiptap/extension-underline')
const {Italic} = require( '@tiptap/extension-italic')
const {ListItem} = require( '@tiptap/extension-list-item')
const {Strike} = require( '@tiptap/extension-strike')
const {TableCell} = require( '@tiptap/extension-table-cell')



const { generateHTML,generateJSON } = require('@tiptap/html')

class Writer extends Tool {
  constructor(fields = {}) {
    super();
    logger.warn('----------init----------');
    this.userId = fields.userId;
    this.senderEmail = fields.senderEmail;
    this.sender = fields.sender;
    this.messages = fields.messages;
    this.conversationId = fields.conversationId;
    const appId = fields.appId;
    this.apiKey = fields.apiKey
    this.url = `https://${appId}.collab.tiptap.cloud/api/documents/doc_${this.conversationId}?format=json`
  }
  name = 'writer';
  description = 'Writing according request';
  description_for_model = 'This is a document read and write tool, it process document in html format. when input is empty it will return the document, when the input is not empty, it will save the input into document.';

  extensions = [
    Document,
    Paragraph,
    Text,
    Bold,
    Emoji,
    Mathematics,
    BulletList,
    CodeBlock,
    Heading,
    HorizontalRule,
    OrderedList, 
    ListItem,
    Image,
    Link,
    Subscript,
    Superscript,
    Table,
    TableHeader,
    TableRow,
    TableCell,
    TaskItem,
    TaskList,
    TextAlign,
    TextStyle,
    Typography,
    Underline,
    Italic,
    Strike,
    // other extensions …
  ]
  async _call(input) {
    logger.warn('call tool ' + input);
    try {
      console.log(input);
      if(input && ""!=input.trim()) {
        const json2 = generateJSON(input, this.extensions)
        console.log(JSON.stringify(json2))
        const res2 = await fetch(this.url, {
          method: "PATCH", // *GET, POST, PUT, DELETE, etc.
          mode: "cors", // no-cors, *cors, same-origin
          cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            "Content-Type": "application/json",
            'Authorization': this.apiKey,
          },
          redirect: "follow", // manual, *follow, error
          referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-u
          body: JSON.stringify(json2)
        });
        console.log(res2)
        return "document saved"
      }else {
        const res = await fetch(this.url, {
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
        const json = await res.json()
        console.log(JSON.stringify(json))
        const html = generateHTML(json, this.extensions)
        console.log(html)      
        return html
      }
    } catch (error) {
      logger.error('Failed to process request. {}',error);
    }
    return 'the tool is failed to process the request';
  }
}

module.exports = Writer;
